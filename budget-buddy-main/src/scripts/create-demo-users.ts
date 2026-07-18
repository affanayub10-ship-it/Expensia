import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables manually to avoid dependency issues
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    envContent.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        process.env[key] = value.trim();
      }
    });
  }
} catch (e) {
  console.warn("Failed to load .env file manually:", e);
}

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Missing Supabase URL or Service Role Key in environment variables.");
  process.exit(1);
}

// Create Supabase Admin client
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const DEMO_USERS = [
  { email: "demo@budgetbuddy.com", password: "Demo@1234", name: "Demo User" },
  { email: "alex@budgetbuddy.com", password: "Alex@1234", name: "Alex Johnson" },
  { email: "test@budgetbuddy.com", password: "Test@1234", name: "Test User" },
  { email: "admin@budgetbuddy.com", password: "Admin@1234", name: "Admin User" },
];

async function createDemoUsers() {
  console.log("🚀 Initializing Demo Accounts Creation Script...");

  for (const demo of DEMO_USERS) {
    console.log(`\n👤 Processing user: ${demo.email}`);

    try {
      // 1. Find existing auth user
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) throw listError;

      const existingUser = usersData.users.find((u) => u.email === demo.email);
      if (existingUser) {
        console.log(`   🧹 Clearing dependent profile records for: ${existingUser.id}`);
        // Delete profiles first because it lacks ON DELETE CASCADE and blocks user deletion
        const { error: profileDelError } = await supabase.from("profiles").delete().eq("id", existingUser.id);
        if (profileDelError) {
          console.warn("   ⚠️  Failed to delete profiles record:", profileDelError.message);
        }

        // Delete user_credentials
        await supabase.from("user_credentials").delete().eq("email", demo.email);

        console.log(`   🗑️  Removing existing auth account: ${existingUser.id}`);
        const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id);
        if (deleteError) throw deleteError;
      }

      // 2. Create the user via Admin API (email is auto-confirmed)
      console.log("   🔑 Creating verified auth user...");
      const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
        email: demo.email,
        password: demo.password,
        email_confirm: true,
        user_metadata: { name: demo.name },
      });
      if (createError) throw createError;

      const user = newUserData.user;
      if (!user) throw new Error("Created user data was empty");
      console.log(`   ✅ User created with UUID: ${user.id}`);

      // Helper function to safely delete and insert in case tables don't exist
      const tryDelete = async (tableName: string, col: string, val: any) => {
        try {
          await supabase.from(tableName).delete().eq(col, val);
        } catch (e) {
          // Table might not exist or be disabled
        }
      };

      // 3. Clean up existing database tables just in case
      console.log("   🧹 Cleaning up any leftover data...");
      await tryDelete("profiles", "id", user.id);
      await tryDelete("user_credentials", "email", demo.email);
      await tryDelete("settings", "user_id", user.id);
      await tryDelete("budgets", "user_id", user.id);
      await tryDelete("expenses", "user_id", user.id);
      await tryDelete("income", "user_id", user.id);
      await tryDelete("savings_goals", "user_id", user.id);
      await tryDelete("payment_methods", "user_id", user.id);

      // 4. Create custom profiles record (this table has a trigger, but we upsert/insert manually to ensure it is verified)
      console.log("   📝 Inserting profiles record...");
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        name: demo.name,
        email: demo.email,
        verified: true,
      });
      if (profileError) {
        console.warn("   ⚠️  Failed to insert profiles record:", profileError.message);
      }

      // 5. Create user_credentials record
      console.log("   🔐 Inserting user_credentials record...");
      const { error: credsError } = await supabase.from("user_credentials").insert({
        email: demo.email,
        password: demo.password,
        name: demo.name,
        is_demo: true,
      });
      if (credsError) {
        console.warn("   ⚠️  Failed to insert user_credentials record:", credsError.message);
      }

      // 6. Create default settings
      console.log("   ⚙️ Inserting default settings...");
      const { error: settingsError } = await supabase.from("settings").upsert({
        user_id: user.id,
        currency: "USD",
        timezone: "America/New_York",
        date_format: "MMM d, yyyy",
        language: "English",
        default_category: "Food",
      });
      if (settingsError) {
        console.warn("   ⚠️  Failed to insert settings record:", settingsError.message);
      }

      // 7. Add default budgets
      console.log("   💰 Inserting default budgets...");
      const { error: budgetsError } = await supabase.from("budgets").insert([
        { user_id: user.id, category: "Food", limit_amount: 600 },
        { user_id: user.id, category: "Fuel", limit_amount: 200 },
        { user_id: user.id, category: "Entertainment", limit_amount: 150 },
        { user_id: user.id, category: "Bills", limit_amount: 800 },
        { user_id: user.id, category: "Shopping", limit_amount: 400 },
      ]);
      if (budgetsError) {
        console.warn("   ⚠️  Failed to insert budgets record:", budgetsError.message);
      }

      // 8. Add sample expenses
      console.log("   💸 Inserting sample expenses...");
      const { error: expensesError } = await supabase.from("expenses").insert([
        {
          user_id: user.id,
          title: "Weekly Groceries",
          amount: 142.5,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          category: "Food",
          payment_method: "Debit Card",
          merchant: "Whole Foods",
          status: "Paid",
          recurrence: "Weekly",
        },
        {
          user_id: user.id,
          title: "Restaurant Dinner",
          amount: 85.0,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          category: "Food",
          payment_method: "Credit Card",
          merchant: "Olive Garden",
          status: "Paid",
          recurrence: "None",
        },
        {
          user_id: user.id,
          title: "Fuel Fill-up",
          amount: 48.2,
          date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          category: "Fuel",
          payment_method: "Credit Card",
          merchant: "Shell",
          status: "Paid",
          recurrence: "None",
        },
        {
          user_id: user.id,
          title: "Netflix Subscription",
          amount: 15.49,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          category: "Entertainment",
          payment_method: "Credit Card",
          merchant: "Netflix",
          status: "Paid",
          recurrence: "Monthly",
        },
        {
          user_id: user.id,
          title: "Electricity Bill",
          amount: 124.6,
          date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          category: "Bills",
          payment_method: "PayPal",
          merchant: "City Power",
          status: "Paid",
          recurrence: "Monthly",
        },
        {
          user_id: user.id,
          title: "Running Shoes",
          amount: 110.0,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          category: "Shopping",
          payment_method: "Credit Card",
          merchant: "Nike",
          status: "Paid",
          recurrence: "None",
        },
      ]);
      if (expensesError) {
        console.warn("   ⚠️  Failed to insert expenses record:", expensesError.message);
      }

      // 9. Add sample income
      console.log("   📈 Inserting sample income...");
      const { error: incomeError } = await supabase.from("income").insert([
        {
          user_id: user.id,
          source: "Monthly Salary",
          amount: 4500.0,
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          category: "Salary",
          recurrence: "Monthly",
          next_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        },
        {
          user_id: user.id,
          source: "Freelance Work",
          amount: 850.0,
          date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          category: "Freelance",
          recurrence: "One-time",
        },
      ]);
      if (incomeError) {
        console.warn("   ⚠️  Failed to insert income record:", incomeError.message);
      }

      // 10. Add sample savings goals
      try {
        console.log("   🎯 Inserting sample savings goals...");
        const { error: savingsError } = await supabase.from("savings_goals").insert([
          {
            user_id: user.id,
            title: "Emergency Fund",
            target_amount: 10000.0,
            current_amount: 4200.0,
            note: "6 months of living expenses",
          },
          {
            user_id: user.id,
            title: "New Laptop",
            target_amount: 1800.0,
            current_amount: 900.0,
            note: "MacBook Pro upgrade",
          },
        ]);
        if (savingsError) console.warn("   ⚠️  Skipped savings goals (probably dropped/missing):", savingsError.message);
      } catch (e) {
        // Table doesn't exist
      }

      console.log(`   ✨ Successfully completed setting up user: ${demo.email}`);
    } catch (err: any) {
      console.error(`   ❌ Failed setup for user ${demo.email}:`, err);
    }
  }

  console.log("\n🏁 Done! All demo accounts are successfully created and populated.");
}

createDemoUsers();
