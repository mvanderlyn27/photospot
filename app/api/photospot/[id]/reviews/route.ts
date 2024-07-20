"use server";
import { Review } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

//get all reviews for photospot
export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  console.log("trying to get reviews for photospot ", params.id);
  const queryParams = request.nextUrl.searchParams;
  let pageSize = 20;
  let pageCount = 1;
  if (queryParams.get("pageCount")) {
    pageCount = parseInt(queryParams.get("pageCount")!);
  }
  let sort = "new";
  if (queryParams.get("sort")) {
    sort = queryParams.get("sort")!;
  }
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  let query = supabase.rpc("get_photospot_reviews", {photospotid: params.id }).select('*').order('owner', {ascending: false, nullsFirst: false});
  if(sort==="new") {
    query.order('created_at', {ascending: false});
  }
  if(sort==="high") {
    query.order('rating', {ascending: false});
  }
  if(sort==="low") {
    query.order('rating', {ascending: true});
  }
  query.range((pageCount - 1) * pageSize, pageCount * pageSize - 1);
  const {data, error}  = await query;
  if (error) {
    console.log('error', error)
    return new NextResponse(error.message, { status: 500 });
  }
  console.log("reviews: ", data);
  return new NextResponse(JSON.stringify(data), { status: 200 });
}
