import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dpgcqisatsodbyhqzvdi.supabase.co'
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwZ2NxaXNhdHNvZGJ5aHF6dmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIzNTkzMDQsImV4cCI6MjAyNzkzNTMwNH0.z0KnzmXkpS6N3VCskbyYVIg72zz6F3nqfR9otJvjxoA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
