import { createClient } from '@supabase/supabase-js';
import customStorage from '../utils/customStorage';

// Initialize Supabase client with actual credentials
const supabaseUrl = 'https://vcxrgxwrnmfxmrxmxgsj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjeHJneHdybm1meG1yeG14Z3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMTk3MTQsImV4cCI6MjA1ODU5NTcxNH0.yPtEyiLAhfKVf_MJreD-2f8sxUX8CwcZq-vACxPaOxk';

// Validate URL before creating client
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    console.error('Invalid Supabase URL:', e.message);
    return false;
  }
};

// Create Supabase client with validation
let supabase;

if (isValidUrl(supabaseUrl)) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: customStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Error initializing Supabase client:', error.message);
    // Provide a fallback client that will show appropriate errors
    supabase = {
      auth: {
        signInWithPassword: () => Promise.reject(new Error('Supabase client not properly initialized')),
        signUp: () => Promise.reject(new Error('Supabase client not properly initialized')),
        signOut: () => Promise.reject(new Error('Supabase client not properly initialized')),
        getSession: () => Promise.reject(new Error('Supabase client not properly initialized')),
        onAuthStateChange: () => ({ unsubscribe: () => {} }),
      },
    };
  }
} else {
  console.error('Invalid Supabase URL provided. Please update the configuration.');
  // Provide a fallback client that will show appropriate errors
  supabase = {
    auth: {
      signInWithPassword: () => Promise.reject(new Error('Invalid Supabase URL configuration')),
      signUp: () => Promise.reject(new Error('Invalid Supabase URL configuration')),
      signOut: () => Promise.reject(new Error('Invalid Supabase URL configuration')),
      getSession: () => Promise.reject(new Error('Invalid Supabase URL configuration')),
      onAuthStateChange: () => ({ unsubscribe: () => {} }),
    },
  };
}

export default supabase;
