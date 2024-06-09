"use server";

import { Photoshot } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    return new Response("Unauthorized", { status: 401 });
  }
  let data = {} as Photoshot;
  const photoshotProimse = supabase
    .from("photoshots")
    .select("*, ...profiles!photoshots_created_by_fkey(username)")
    .eq("id", params.id)
    .single();
  const countPromise = supabase
    .from("photoshot_like_counts")
    .select("*")
    .eq("photoshot_id", params.id)
    .single();

  const tagPromise = supabase
    .from("photoshot_tags")
    .select("*, ...tags(name)")
    .eq("id", params.id);
  const savePromise = supabase
    .from("saved_photoshots")
    .select("*")
    .eq("id", user.data.user.id)
    .eq("photoshot_id", parseInt(params.id))
    .single();
  return Promise.all([photoshotProimse, countPromise, tagPromise, savePromise])
    .then((values) => {
      //adds photoshot and count data
      const photoshotBaseData = values[0].data;
      const like_count = values[1].data?.like_count;
      const tags = values[2].data?.map((tag) => {
        return tag.name;
      });
      const isSaved = values[3].data ? true : false;
      const owner = photoshotBaseData?.created_by === user.data.user?.id;

      data = {
        ...photoshotBaseData,
        like_count: like_count ? like_count : 0,
        tags: tags ? tags : [],
        isSaved: isSaved,
        owner: owner,
      } as Photoshot;
      return NextResponse.json(data);
    })
    .catch((error) => {
      console.log("error", error);
      return new Response("error getting photoshot info " + error.message, {
        status: 401,
      });
    });
}
