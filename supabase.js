import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://hsyunxmwwlhqmrowtarw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzeXVueG13d2xocW1yb3d0YXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA2OTAwMzksImV4cCI6MjA1NjI2NjAzOX0.XE3l-YrrwVy4U5rrPB8j-dKu-EX4fsvapcTUTiObrcQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);