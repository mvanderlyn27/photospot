"use server";
import { Photoshot, Photospot } from "@/types/photospotTypes";
import { sortByOwnershipAndDate } from "@/utils/common/sort";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new Response("not logged in", { status: 401 });
  }
  const { data, error } = await supabase
    .from("photoshots")
    .select("*, ...profiles!photoshots_created_by_fkey(username)")
    .eq("photospot_id", params.id);
  if (error) {
    console.log("error", error);
    return new Response(error.message, { status: 500 });
  }
  //move users to front and add owner tag
  let photoshotAr = data?.map((photoshot: Photoshot) => {
    if (photoshot.created_by === user.data.user?.id) {
      photoshot.owner = true;
    }
    return photoshot;
  });
  photoshotAr.sort(sortByOwnershipAndDate);
  return NextResponse.json(photoshotAr);
}
