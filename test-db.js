const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function test() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log("URL:", supabaseUrl);
  console.log("Key Prefix:", supabaseAnonKey ? supabaseAnonKey.substring(0, 10) : "Missing");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing env variables");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data, error } = await supabase.from('dilemmas').insert([
      { 
        dilemma: "Test Dilemma", 
        recommendation: "Test Recommendation", 
        confidence: 99.9, 
        perspectives: { logic: 100 }
      }
    ]).select();

    if (error) {
      console.error("Supabase Error:", error.message);
    } else {
      console.log("Success! Data saved:", data);
    }
  } catch (err) {
    console.error("Exception:", err.message);
  }
}

test();
