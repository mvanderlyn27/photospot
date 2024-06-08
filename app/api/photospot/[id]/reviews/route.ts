"use server";
import { Review } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

//get all reviews for photospot
export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  console.log("trying to get reviews for photospot ", params.id);
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("photospot_reviews")
    .select("*, ...profiles(username)")
    .eq("photospot_id", params.id);
  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }
  //todo add photospot type
  const { data: updateReviews, error: updateError } = await supabase
    .from("photospot_reviews")
    .select("*, ...profiles(username)")
    .eq("photospot_id", params.id);
  if (updateError) {
    console.log("error getting reviews with username", updateError);
    return new NextResponse(updateError.message, { status: 500 });
  }
  let userReview: Review | undefined = updateReviews.find(
    (review: any) => review.created_by === userData.user?.id
  );
  let reviewAr = updateReviews as Review[];
  if (userReview) {
    const index = reviewAr.indexOf(userReview);
    reviewAr.splice(index, 1);
    userReview.owner = true;
    reviewAr.unshift(userReview);
  }
  return NextResponse.json(reviewAr);
}
