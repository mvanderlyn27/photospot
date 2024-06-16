"use server";

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { id: number } }) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("photoshots")
    .select("photo_paths")
    .eq("photospot_id", params.id)
    .order("rating", { ascending: false })
    .limit(1)
    .single();
  if (error) {
    return new Response(error.message, { status: 500 });
  }
  return NextResponse.json(data);
}
