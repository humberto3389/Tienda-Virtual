const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kuvglujjhogwjrvhuccl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1dmdsdWpqaG9nd2pydmh1Y2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjg3NTUsImV4cCI6MjA4ODYwNDc1NX0.bjTiUSzX4_WkLYF29TTnRPJqDKHEPvX_-qLuSiZQ39c';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAuthAndRole() {
  console.log('--- Auth Check ---');
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('Session error:', sessionError.message);
  } else if (!session) {
    console.log('No active session (Anonymous).');
  } else {
    console.log('Active session for user:', session.user.id);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (profileError) {
      console.error('Profile error:', profileError.message);
    } else {
      console.log('User role:', profile.role);
    }
  }

  console.log('\n--- RLS Check on "services" ---');
  const { data, error } = await supabase.from('services').select('*').limit(1);
  if (error) {
    console.error('Select error:', error.message);
  } else {
    console.log('Select successful, found', data.length, 'records.');
  }
}

checkAuthAndRole();
