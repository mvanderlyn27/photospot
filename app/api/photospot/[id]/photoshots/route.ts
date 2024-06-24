"use server";
import { Photoshot, Photospot } from "@/types/photospotTypes";
import { sortByOwnershipAndDate } from "@/utils/common/sort";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

//maybe move some of the logic so we get basic info on all the photoshots, then when opening up a photoshot we get better info
const PAGE_SIZE = 20;
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const supabase = createClient();
let pageCountRaw = searchParams.get('pageCount');
    let pageCount = 1;
    if (pageCountRaw) {
        pageCount = parseInt(pageCountRaw);
    }
const { data, error } = await supabase
    .from("photoshots")
    .select("*")
    .eq("photospot_id", params.id).order("created_at", { ascending: false })
    .range((pageCount-1)*PAGE_SIZE, (pageCount)*PAGE_SIZE );
  if (error) {
    console.log("error", error);
    return new Response(error.message, { status: 500 });
  }
  console.log("photoshots", data);
  //move users to front and add owner tag
  return new Response(JSON.stringify(data), { status: 200 });
}
