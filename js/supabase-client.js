// js/supabase-client.js (Corrected Version)

const SUPABASE_URL = 'https://uxsctfounsfvqkjfawnq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4c2N0Zm91bnNmdnFramZhd25xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMTEwNjEsImV4cCI6MjA2NzY4NzA2MX0.1cZGZOaeeHFLOJrwzg6bB1ZzHaN2j9qgJ4py5zglhf4';

// This gets the createClient function from the Supabase library
const { createClient } = supabase;

// This uses the function to create your own client, which we export
export const supabase_client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
