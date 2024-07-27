"use server";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  console.log("trying to save");
  const supabase = createClient();
  const photospotId = params.id;
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new Response("not logged in", { status: 401 });
  }
  const data = {
    id: user.data.user.id,
    photospot: photospotId,
  };
  const { error } = await supabase.from("saved_photospots").upsert(data);
  if (error) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }

  console.log(
    "successfully added",
    user.data.user.id,
    " saved spot ",
    photospotId
  );
  return new NextResponse(null, { status: 200 });
}
