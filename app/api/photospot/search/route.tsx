"use server";
import { sortOptions } from "@/components/explorePage/filterSearchForm";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/*
UDPATES:
- need to update search so that it only takes in filters
    - tags
    - maximum distance
    - minimum rating
    - sort type
    - direction
    -lat
    -lng

*/
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  let pageCount = 1;
  let pageSize = 20;
  let sortColumn = "created_at";
  let sortDirection = "desc";
  let args: {
    tags?: number[];
    maximumdistance: number | null;
    minimumrating: number | null;
    latt: number | null;
    lngg: number | null;
  } = {
    tags: undefined,
    maximumdistance: null,
    minimumrating: null,
    latt: null,
    lngg: null,
  };
  let pageCountRaw = searchParams.get("pageCount");
  if (pageCountRaw) {
    pageCount = parseInt(pageCountRaw);
  }

  let tagsRaw = searchParams.getAll("tags");
  if (tagsRaw.length > 0) {
    args.tags = tagsRaw.map((tag) => parseInt(tag));
  }

  let minimumRatingRaw = searchParams.get("minRating");
  if (minimumRatingRaw) {
    args.minimumrating = parseFloat(minimumRatingRaw);
  }
  let sortRaw = searchParams.get("sort");
  if (sortRaw && ["rating", "nearby", "new"].includes(sortRaw)) {
    if (sortRaw === "rating") {
      sortColumn = "rating";
      sortDirection = "desc";
    } else if (sortRaw === "nearby") {
      sortColumn = "dist_meters";
      sortDirection = "asc";
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
  const { data, error } = await supabase
    .rpc("search_photospots", args)
    .select("*")
    .range((pageCount - 1) * pageSize, pageCount * pageSize - 1)
    .order(sortColumn, { ascending: sortDirection === "asc" });

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
