"use server";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  console.log("params", params);
  const { userId } = params;
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    console.log("not logged in");
    return new Response(null, { status: 403, statusText: "unauthorized" });
  }
  console.log("userId, user.id", userId, user.id);
  const { error } = await supabase
    .from("user_follows")
    .delete()
    .eq("follower", user.id)
    .eq("followee", userId);
  if (error) {
    console.log("error", error);
    return new Response(null, {
      status: 500,
      statusText: "issue unfollowing user",
    });
  }
  return NextResponse.json({ success: true });
}
