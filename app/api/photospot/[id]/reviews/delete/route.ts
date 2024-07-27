"use server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new Response("no user found", { status: 401 });
  }
  const { data, error } = await supabase
    .from("photospot_reviews")
    .delete()
    .eq("created_by", user.data.user.id)
    .eq("photospot_id", id);
  if (error) {
    console.log("delete error", error);
    return new Response(error.message, { status: 500 });
  }
  const { data: reviewsAfterDelete, error: reviewError } = await supabase
    .from("photospot_reviews")
    .select("*, ...profiles(username)")
    .eq("photospot_id", id);
  if (reviewError) {
    console.log("reviewError", reviewError);
    return new Response(reviewError.message, { status: 500 });
  }
  console.log("successful delete", data);
  return NextResponse.json(reviewsAfterDelete);
}
