import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ywirrpombadpwuwfdidz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3aXJycG9tYmFkcHd1d2ZkaWR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2Mzg4NTcsImV4cCI6MjAzODIxNDg1N30.pxbvsp0aXXjQ2DO8nbb_iXxpWlg76gF2E-AvlpPxGfY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
