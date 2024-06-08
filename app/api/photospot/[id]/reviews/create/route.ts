"use server";
import { Review } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

//creates review for a photospot
export async function POST(
  request: Request,
  { params }: { params: { id: number } }
) {
  const inputData = await request.json();
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!inputData || !user.data.user?.id) {
    return new NextResponse("not logged in, or no input", { status: 401 });
  }
  const { data, error } = await supabase.from("photospot_reviews").insert({
    created_by: user.data.user.id,
    photospot_id: params.id,
    text: inputData.text,
    rating: inputData.rating,
  });
  if (error) {
    console.log("error creating review", error);
    return new NextResponse(error.message, { status: 500 });
  }
  //should put users response first
  const { data: updateReviews, error: updateError } = await supabase
    .from("photospot_reviews")
    .select("*, ...profiles(username)")
    .eq("photospot_id", params.id);
  if (updateError) {
    console.log("fetch reviews error");
    return new NextResponse(updateError.message, { status: 500 });
  }
  let userReview: Review | undefined = updateReviews.find(
    (review: any) => review.created_by === user.data.user?.id
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
