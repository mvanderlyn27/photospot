"use server";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new Response("not logged in", { status: 401 });
  }
  const { data, error } = await supabase.from("photospots").select("*");
  if (error) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function searchPhotospots(
  name?: string,
  searchMode?: string,
  tags?: number[]
) {
  //TODO: implement searchk
  return [];
}
