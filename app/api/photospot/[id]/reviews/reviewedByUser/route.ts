import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new NextResponse("no user found", { status: 401 });
  }
  const { data, error } = await supabase
    .from("photospot_reviews")
    .select("*")
    .eq("photospot_id", id)
    .eq("created_by", user.data.user.id)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  if (!data) {
    return new NextResponse("false", { status: 200 });
  }
  return new NextResponse("true", { status: 200 });
}
