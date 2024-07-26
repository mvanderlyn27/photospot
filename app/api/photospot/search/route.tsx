"use server";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let pageCount = 1;
  let pageSize = 20;
  let sortColumn = undefined;
  let sortDirection = undefined;
  let args: {
    photospotname?: string;
    tags?: number[];
    maximumdistance: number | null;
    minimumrating: number | null;
    latt: number | null;
    lngg: number | null;
  } = {
    photospotname: undefined,
    tags: undefined,
    maximumdistance: null,
    minimumrating: null,
    latt: null,
    lngg: null,
  };
  let pageCountRaw = searchParams.get("page");
  if (pageCountRaw) {
    pageCount = parseInt(pageCountRaw);
  }
  let photospotNameRaw = searchParams.get("photospotName");
  if (photospotNameRaw) {
    args.photospotname = photospotNameRaw;
  }
  let tagsRaw = searchParams.get("tags");
  if (tagsRaw) {
    args.tags = tagsRaw.split(",").map((tag) => parseInt(tag));
  }

  let minimumRatingRaw = searchParams.get("minRating");
  if (minimumRatingRaw) {
    args.minimumrating = parseFloat(minimumRatingRaw);
  }
  let sortRaw = searchParams.get("sort");
  if (sortRaw && ["rating", "nearby", "new"].includes(sortRaw)) {
    if (sortRaw === "rating") {
      sortColumn = "rating_average";
      sortDirection = "desc";
    } else if (sortRaw === "nearby") {
      sortColumn = "dist_meters";
      sortDirection = "asc";
    } else {
      sortColumn = "created_at";
      sortDirection = "desc";
    }
  }
  let latRaw = searchParams.get("lat");
  let lngRaw = searchParams.get("lng");
  if (latRaw && lngRaw) {
    args.latt = parseFloat(latRaw);
    args.lngg = parseFloat(lngRaw);
    let maximumDistanceRaw = searchParams.get("maxDistance");
    if (maximumDistanceRaw) {
      args.maximumdistance = parseFloat(maximumDistanceRaw);
    }
  }
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user?.data.user) {
    return new Response("not logged in", { status: 401 });
  }
  //depending on search mode
  console.log("args", args);
  let query = supabase
    .rpc("search_photospots", args)
    .select("*")
    .range((pageCount - 1) * pageSize, pageCount * pageSize - 1);
  if (sortColumn && sortDirection) {
    query.order(sortColumn, { ascending: sortDirection === "asc" });
  }
  const { data, error } = await query;
  if (error) {
    console.log(error);
    return new Response(error.message, { status: 500 });
  }
  console.log("page", pageCount, "data", data);
  return NextResponse.json(data);
}
