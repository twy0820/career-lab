import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qgqmxxcdzjvljckewvhd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFncW14eGNkemp2bGpja2V3dmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNzQzMTgsImV4cCI6MjEwNTY1MDMxOH0.QIFcgS36p_Yu46FyIRfAHjzZSKDvuovsIqyE-05ScdY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
