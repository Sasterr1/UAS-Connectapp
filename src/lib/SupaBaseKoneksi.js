import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qaxrjnwtbrcbhxuzrgpo.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFheHJqbnd0YnJjYmh4dXpyZ3BvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzg1MjAsImV4cCI6MjA2Njg1NDUyMH0.zvYHbh3WQxmA6O06_SdPRvHZ1bR-i6uXByC2OAJA9EY';     
export const supabase = createClient(supabaseUrl, supabaseAnonKey);