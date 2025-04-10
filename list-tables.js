import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with your credentials
const supabaseUrl = 'https://vcxrgxwrnmfxmrxmxgsj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeHJneHdybm1meG1yeG14Z3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTk3MTQsImV4cCI6MjA1ODU5NTcxNH0.yPtEyiLAhfKVf_MJreD-2f8sxUX8CwcZq-vACxPaOxk';

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to list all tables in the database
async function listTables() {
  try {
    // Query the information_schema to get table information
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.error('Error fetching tables:', error);
      return;
    }
    
    console.log('Tables in your database:');
    if (data && data.length > 0) {
      for (const table of data) {
        console.log(`- ${table.table_name}`);
      }
    } else {
      console.log('No tables found in the public schema.');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Function to get table structure
async function getTableStructure(tableName) {
  try {
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_schema', 'public')
      .eq('table_name', tableName);
    
    if (error) {
      console.error(`Error fetching structure for table ${tableName}:`, error);
      return;
    }
    
    console.log(`\nStructure for table: ${tableName}`);
    if (data && data.length > 0) {
      console.log('Column Name | Data Type | Nullable');
      console.log('------------|-----------|----------');
      for (const column of data) {
        console.log(`${column.column_name} | ${column.data_type} | ${column.is_nullable}`);
      }
    } else {
      console.log(`No columns found for table ${tableName}.`);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Main function to run the script
async function main() {
  await listTables();
  
  // After listing tables, you can uncomment and modify this to get structure for specific tables
  // await getTableStructure('your_table_name');
}

// Run the script
main();
