import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn('Supabase credentials are not configured');
}

console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key:', SUPABASE_KEY);

// Configure auth based on platform
const authConfig = {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
};

// Only add storage for native platforms
if (Platform.OS !== 'web') {
    Object.assign(authConfig, { storage: AsyncStorage });
}

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: authConfig,
});

export default supabaseClient;
