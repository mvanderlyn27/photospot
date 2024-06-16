"use server";

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  console.log("id", params);

  const { data, error } = await supabase.rpc("find_most_liked_photoshot", {
    input_id: parseInt(params.id),
  });
  if (error) {
    console.log("error getting top photoshot for " + params.id, error);
    return new Response(error.message, { status: 500 });
  }
  console.log("top photoshot", data);
  return NextResponse.json(data);
}
