"use server";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log("not logged in");
    return new Response(null, { status: 403, statusText: "unauthorized" });
  }
  const { error } = await supabase
    .from("user_follows")
    .insert({
      follower: user.id,
      followee: userId,
    })
    .select("*");
  if (error) {
    console.log("error", error);
    return new Response(null, {
      status: 500,
      statusText: "issue following user",
    });
  }
  return NextResponse.json({ success: true });
}
