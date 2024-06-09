"use server";

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { data, error } = await supabase
    .from("photoshot_likes")
    .select("*")
    .eq("created_by", user.data.user.id)
    .eq("photoshot_id", parseInt(params.id))
    .single();
  if (error) {
    console.log("error", error);
    return new Response("Error saving photoshot", { status: 500 });
  }
  if (data) {
    return NextResponse.json(true);
  } else {
    return NextResponse.json(false);
  }
}
