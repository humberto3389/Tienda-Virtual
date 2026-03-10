const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kuvglujjhogwjrvhuccl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dmdsdWpqaG9nd2pydmh1Y2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjg3NTUsImV4cCI6MjA4ODYwNDc1NX0.bjTiUSzX4_WkLYF29TTnRPJqDKHEPvX_-qLuSiZQ39c';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTable(tableName) {
  console.log(`--- Inspecting "${tableName}" ---`);
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);

  if (error) {
    console.log(`Error: ${error.message}`);
  } else {
    console.log(`Found ${data.length} records.`);
    if (data.length > 0) {
      console.log('Columns:', Object.keys(data[0]));
      console.log('Data:', data[0]);
    } else {
      console.log('Table is empty.');
    }
  }
}

async function main() {
  await inspectTable('services');
  await inspectTable('servicios');
  await inspectTable('products');
}

main();
