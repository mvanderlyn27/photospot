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
  const { data: savedPhotospots, error: savedPhotospotError } =
    await supabase.rpc("get_saved_photospots", {
      user_id: params.userId,
      page_count: pageCount,
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
