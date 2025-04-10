import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// Note: In a real app, you would use environment variables for these values
const supabaseUrl = 'https://vcxrgxwrnmfxmrxmxgsj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeHJneHdybm1meG1yeG14Z3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTk3MTQsImV4cCI6MjA1ODU5NTcxNH0.yPtEyiLAhfKVf_MJreD-2f8sxUX8CwcZq-vACxPaOxk';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test function to verify connection
async function testSupabaseConnection() {
  try {
    // Test the connection by checking auth status
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return false;
    }
    
    console.log('Successfully connected to Supabase!');
    console.log('Session data:', data);
    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Run the test
testSupabaseConnection()
  .then(success => {
    console.log('Connection test completed. Success:', success);
  })
  .catch(err => {
    console.error('Test failed with error:', err);
  });
