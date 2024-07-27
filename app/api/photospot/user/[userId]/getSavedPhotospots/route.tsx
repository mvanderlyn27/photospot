"use server";
import { Photoshot, Photospot } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const queryParams = request.nextUrl.searchParams;

  //create rpc function to get saved photospots, then return them with their top liked photoshots photo info
  const supabase = createClient();
  let pageCount = 1;
  if (queryParams.get("pageCount")) {
    pageCount = parseInt(queryParams.get("pageCount")!);
  }
  let lat = null;
  let lng = null;
  if (queryParams.get("lat") && queryParams.get("lng")) {
    console.log("lat", queryParams.get("lat"), "lng", queryParams.get("lng"));
    lat = parseFloat(queryParams.get("lat")!);
    lng = parseFloat(queryParams.get("lng")!);
  }
  const { data: savedPhotospots, error: savedPhotospotError } =
    await supabase.rpc("get_saved_photospots", {
      user_id: params.userId,
      page_count: pageCount,
      latt: lat ? lat : undefined,
      lngg: lng ? lng : undefined,
    });
  if (savedPhotospotError) {
    console.log("error", savedPhotospotError);
    return new Response(
      JSON.stringify({ error: "gettting saved photospots" }),
      {
        status: 500,
      }
    );
  }
  console.log("savedPhotospots: ", savedPhotospots);
  return NextResponse.json(savedPhotospots);
}
//look at nearby photospots for example
