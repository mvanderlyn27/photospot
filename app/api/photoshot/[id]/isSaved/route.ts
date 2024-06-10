"use server";

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { data, error } = await supabase
    .from("saved_photoshots")
    .select("*")
    .eq("id", user.data.user.id)
    .eq("photoshot_id", parseInt(params.id))
    .single();
  if (error || !data) {
    if (error && error.code !== "PGRST116") {
      console.log("error", error);
      return new Response("error checking saved", { status: 401 });
    }
    return NextResponse.json(false);
  }
  return NextResponse.json(true);
}
