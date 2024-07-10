"use server";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  //get pageCount, namePhotospot,  searchMode, tags
  const searchParams = request.nextUrl.searchParams;
  let args: {
    pageCount: number;
    pageSize?: number;
    photospot_name?: string;
    tags?: number[];
  } = {
    pageCount: 1,
    pageSize: 20,
    tags: undefined,
    photospot_name: undefined,
  };
  let pageCountRaw = searchParams.get("pageCount");
  if (pageCountRaw) {
    args.pageCount = parseInt(pageCountRaw);
  }
  let photospotNameRaw = searchParams.get("photospotName");
  if (photospotNameRaw) {
    args.photospot_name = photospotNameRaw;
  }
  let tagsRaw = searchParams.getAll("tags");
  if (tagsRaw.length > 0) {
    args.tags = tagsRaw.map((tag) => parseInt(tag));
  }
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user?.data.user) {
    return new Response("not logged in", { status: 401 });
  }
  //depending on search mode
  // //   if (searchModeRaw === "nearby") {
  // //     const { data, error } = await supabase.rpc(
  // //       "search_nearby_photospots",
  // //       args
  // //     );
  // //   } else if (searchModeRaw === "top") {
  // //     const { data, error } = await supabase.rpc("search_top_photospots", args);
  // //   } else if (searchModeRaw === "saved") {
  // //     const { data, error } = await supabase.rpc("search_saved_photospots", args);
  // //   } else {
  console.log("searching", args);
  const { data, error } = await supabase.rpc("search_photospots", {
    page_count: args.pageCount,
    photospot_name: args.photospot_name,
    tags: args.tags,
  });
  //   }
  if (error) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
  console.log("data", data);
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
