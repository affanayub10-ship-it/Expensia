import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fgsrxibdmkssywrpbxzv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnc3J4aWJkbWtzc3l3cnBieHp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1MDYyMDMsImV4cCI6MjA5OTA4MjIwM30.ftgC9E_MxKvDI3h8AuPsh8zxoEBk61Yz-mvloY-zMzI";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Testing direct Supabase signUp...");
  try {
    const { data, error } = await supabase.auth.signUp({
      email: "arezpagal@gmail.com",
      password: "are555",
      options: {
        data: { name: "are55" },
        emailRedirectTo: "http://localhost:5173/verify",
      },
    });
    console.log("Supabase signUp Result:");
    console.log("Data:", JSON.stringify(data, null, 2));
    console.log("Error:", JSON.stringify(error, null, 2));
  } catch (error: any) {
    console.error("Caught error:", error);
  }
}

run();
