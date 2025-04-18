import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ajmipacroemzdqnhyotr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbWlwYWNyb2VtemRxbmh5b3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NjIyNjAsImV4cCI6MjA2MDUzODI2MH0.FzT19y3EpXLIUG5qmXsdSsWdAFFfduGkv_iJRubQed8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});