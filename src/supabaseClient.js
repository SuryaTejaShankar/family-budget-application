import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://onsegktcarzyksobefji.supabase.co'; // replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uc2Vna3RjYXJ6eWtzb2JlZmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MjE0NjYsImV4cCI6MjA3MDQ5NzQ2Nn0.-CA-RpbbKdjNwE10ZY7RIeUfBJ7wfkKLRUVdH6vjqx0';            // replace with your anon/public key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
