"use server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  //maybe create new user object which stores user/profile info
  return new Response(JSON.stringify(data.user));
}
