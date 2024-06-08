"use server";
import { Photoshot, Photospot } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";

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
    .select("*")
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
  const sortedArray = [
    ...photoshotAr.filter(({ owner }) => owner),
    ...photoshotAr.filter(({ owner }) => !owner),
  ];
  console.log("photoshots with owner", sortedArray);
  return new Response(JSON.stringify(data), { status: 200 });
}
