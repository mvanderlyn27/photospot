"use server";

import { createClient } from "@/utils/supabase/server";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  let data = {};
  const photoshotProimse = supabase
    .from("photoshots")
    .select("*")
    .eq("id", params.id)
    .single();
  const countPromise = supabase
    .from("photoshot_like_counts")
    .select("*")
    .eq("photoshot_id", params.id)
    .single();
  Promise.all([photoshotProimse, countPromise]).then((values) => {
    data = { ...values[0], ...values[1] };
  });
  return new Response(JSON.stringify(data), { status: 200 });
}
