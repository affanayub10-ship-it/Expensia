/**
 * Migration Script: Import existing data from db.json to Supabase
 * 
 * This script will:
 * 1. Read data from data/db.json
 * 2. Create a test user account
 * 3. Import all expenses, income, budgets, etc. to Supabase
 * 
 * Run with: npx tsx src/scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://fgsrxibdmkssywrpbxzv.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwNjIwMywiZXhwIjoyMDk5MDgyMjAzfQ.XomizeTjrQxc53CBEANVLYQTx6wdOeIkOv-fUQo_ig4';

// Use service key to bypass RLS for migration
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface DbData {
  expenses: any[];
  income: any[];
  budgets: any[];
  notifications: any[];
  paymentMethods: string[];
  settings: {
    currency: string;
    timezone: string;
    dateFormat: string;
    language: string;
    defaultPaymentMethod: string;
    defaultCategory: string;
    name: string;
    email: string;
  };
}

async function migrate() {
  console.log('🚀 Starting migration to Supabase...\n');

  // Read data from db.json
  const dbPath = path.resolve(process.cwd(), 'data', 'db.json');
  const rawData = fs.readFileSync(dbPath, 'utf-8');
  const data: DbData = JSON.parse(rawData);

  console.log('📖 Read data from db.json:');
  console.log(`   - ${data.expenses.length} expenses`);
  console.log(`   - ${data.income.length} income records`);
  console.log(`   - ${data.budgets.length} budgets`);
  console.log(`   - ${data.notifications.length} notifications`);
  console.log(`   - ${data.paymentMethods.length} payment methods\n`);

  // Step 1: Create a test user
  console.log('👤 Creating test user...');
  const testEmail = data.settings.email;
  const testPassword = 'Test@1234'; // Default password for migration
  const testName = data.settings.name;

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: { name: testName },
    },
  });

  if (signUpError) {
    // User might already exist
    console.log(`   ⚠️  User might already exist: ${signUpError.message}`);
    console.log('   Attempting to sign in...');
    
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.error('   ❌ Failed to sign in:', signInError.message);
      console.log('\n💡 If user exists with different password, please:');
      console.log('   1. Delete the user from Supabase Dashboard');
      console.log('   2. Run this script again\n');
      return;
    }

    console.log('   ✅ Signed in successfully');
  } else {
    console.log(`   ✅ Test user created: ${testEmail}`);
    console.log(`   🔑 Password: ${testPassword} (use this to login)\n`);
  }

  // Get user ID
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error('❌ Failed to get user');
    return;
  }

  const userId = user.id;
  console.log(`   User ID: ${userId}\n`);

  // Step 2: Import settings
  console.log('⚙️  Importing settings...');
  const { error: settingsError } = await supabase
    .from('settings')
    .upsert({
      user_id: userId,
      currency: data.settings.currency,
      timezone: data.settings.timezone,
      date_format: data.settings.dateFormat,
      language: data.settings.language,
      default_payment_method: data.settings.defaultPaymentMethod,
      default_category: data.settings.defaultCategory,
    }, {
      onConflict: 'user_id'
    });

  if (settingsError) {
    console.error('   ❌ Error importing settings:', settingsError.message);
  } else {
    console.log('   ✅ Settings imported\n');
  }

  // Step 3: Import payment methods
  console.log('💳 Importing payment methods...');
  for (const method of data.paymentMethods) {
    const { error } = await supabase
      .from('payment_methods')
      .upsert({
        user_id: userId,
        name: method,
      }, {
        onConflict: 'user_id,name',
        ignoreDuplicates: true
      });

    if (error && error.code !== '23505') {
      console.error(`   ❌ Error importing ${method}:`, error.message);
    }
  }
  console.log(`   ✅ ${data.paymentMethods.length} payment methods imported\n`);

  // Step 4: Import expenses
  console.log('💰 Importing expenses...');
  const expenses = data.expenses.map(exp => ({
    user_id: userId,
    title: exp.title,
    amount: exp.amount,
    date: exp.date,
    category: exp.category,
    payment_method: exp.paymentMethod,
    merchant: exp.merchant,
    location: exp.location,
    currency: exp.currency || 'USD',
    tags: exp.tags || [],
    status: exp.status || 'Paid',
    recurrence: exp.recurrence || 'None',
    receipt: exp.receipt,
    deleted: exp.deleted || false,
  }));

  const { error: expensesError } = await supabase
    .from('expenses')
    .insert(expenses);

  if (expensesError) {
    console.error('   ❌ Error importing expenses:', expensesError.message);
  } else {
    console.log(`   ✅ ${expenses.length} expenses imported\n`);
  }

  // Step 5: Import income
  console.log('💵 Importing income...');
  const incomeRecords = data.income.map(inc => ({
    user_id: userId,
    source: inc.source,
    amount: inc.amount,
    date: inc.date,
    category: inc.category,
    currency: inc.currency || 'USD',
    notes: inc.notes,
  }));

  const { error: incomeError } = await supabase
    .from('income')
    .insert(incomeRecords);

  if (incomeError) {
    console.error('   ❌ Error importing income:', incomeError.message);
  } else {
    console.log(`   ✅ ${incomeRecords.length} income records imported\n`);
  }

  // Step 6: Import budgets
  console.log('📊 Importing budgets...');
  const budgets = data.budgets.map(budget => ({
    user_id: userId,
    category: budget.category,
    limit_amount: budget.limit,
  }));

  const { error: budgetsError } = await supabase
    .from('budgets')
    .insert(budgets);

  if (budgetsError) {
    console.error('   ❌ Error importing budgets:', budgetsError.message);
  } else {
    console.log(`   ✅ ${budgets.length} budgets imported\n`);
  }

  // Step 7: Import notifications
  console.log('🔔 Importing notifications...');
  const notifications = data.notifications.map(notif => ({
    user_id: userId,
    type: notif.type,
    title: notif.title,
    message: notif.message,
    read: notif.read || false,
  }));

  const { error: notificationsError } = await supabase
    .from('notifications')
    .insert(notifications);

  if (notificationsError) {
    console.error('   ❌ Error importing notifications:', notificationsError.message);
  } else {
    console.log(`   ✅ ${notifications.length} notifications imported\n`);
  }

  console.log('✨ Migration completed successfully!\n');
  console.log('📝 Login credentials:');
  console.log(`   Email: ${testEmail}`);
  console.log(`   Password: ${testPassword}\n`);
  console.log('🎉 You can now use your app with Supabase!\n');
}

// Run migration
migrate().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
