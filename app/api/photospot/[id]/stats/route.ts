"use server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photospot_rating_stats")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error) {
    console.log("stat error", error);
    return new Response(error.message, { status: 500 });
  }
  return NextResponse.json(data);
}
