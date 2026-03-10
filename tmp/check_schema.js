const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kuvglujjhogwjrvhuccl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dmdsdWpqaG9nd2pydmh1Y2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjg3NTUsImV4cCI6MjA4ODYwNDc1NX0.bjTiUSzX4_WkLYF29TTnRPJqDKHEPvX_-qLuSiZQ39c';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('Checking for "services" table...');
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .limit(1);

  if (error) {
    if (error.code === 'PGRST116' || error.message.includes('not found')) {
      console.log('Table "services" does NOT exist.');
    } else {
      console.error('Error checking "services" table:', error);
    }
  } else {
    console.log('Table "services" EXISTS.');
    console.log('Sample data:', data);
  }

  console.log('\nChecking for other relevant tables...');
  // We can't easily list all tables via the public API without RPC or special permissions,
  // but we can guess common names.
  const tablesToTry = ['servicios', 'service_details', 'categories'];
  for (const table of tablesToTry) {
    const { error: tableError } = await supabase.from(table).select('*', { count: 'exact', head: true }).limit(1);
    if (!tableError) {
      console.log(`Table "${table}" EXISTS.`);
    } else {
      console.log(`Table "${table}" does NOT exist (or error: ${tableError.message})`);
    }
  }
}

checkTables();
