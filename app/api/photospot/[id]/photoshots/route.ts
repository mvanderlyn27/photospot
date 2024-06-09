"use server";
import { Photoshot, Photospot } from "@/types/photospotTypes";
import { sortByOwnershipAndDate } from "@/utils/common/sort";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

//maybe move some of the logic so we get basic info on all the photoshots, then when opening up a photoshot we get better info
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
  let photoshotPromiseAr = data?.map(async (photoshot: Photoshot) => {
    const { data: count, error: countError } = await supabase
      .from("photoshot_like_counts")
      .select("*")
      .eq("photoshot_id", photoshot.id)
      .single();
    photoshot.like_count = 0;
    if (count) {
      photoshot.like_count = count.like_count;
    }
    if (photoshot.created_by === user.data.user?.id) {
      photoshot.owner = true;
    }
    return photoshot;
  });
  return await Promise.all(photoshotPromiseAr)
    .then((photoshotAr) => {
      photoshotAr.sort(sortByOwnershipAndDate);
      return NextResponse.json(photoshotAr);
    })
    .catch((error) => new Response(error.message, { status: 500 }));
}
