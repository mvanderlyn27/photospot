"use server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST({ params }: { params: { userId: string } }) {
  const { userId } = params;
  const supabase = createClient();
  const { error } = await supabase
    .from("user_follows")
    .delete()
    .eq("follower", userId)
    .eq("followee", params.userId);
  if (error) {
    console.log("error", error);
    return new Response(JSON.stringify({ error: "issue unfollowing user" }), {
      status: 500,
    });
  }
  return NextResponse.json({ success: true });
}
