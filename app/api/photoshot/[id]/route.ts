"use server";

import { createClient } from "@/utils/supabase/server";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photoshots")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error) {
    console.log("error", error);
    return new Response(error.message, { status: 500 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}
