"use server";
import { editPhotobookPictureSchema } from "@/components/photoshot/editPhotobookPicture";
import { editReviewSchema } from "@/components/review/editReviewDialog";
import { PhotobookPicture, Review } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { randomNumber } from "@/utils/common/math";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
export default async function editReview(
  reviewId: number,
  reviewInfo: z.infer<typeof editReviewSchema>
): Promise<Review> {
  if (!reviewInfo || !reviewInfo.rating) {
    redirect("/error?error=missing info for edit");
  }

  console.log("reviewInfo", reviewInfo);
  const supabase = createClient();
  const user = await supabase.auth.getUser();
  if (!user.data.user) {
    redirect("/error?error=not logged in");
  }

  // need to handle removing old photos here fromt he bucket

  const { data: uploadData, error: uploadError } = await supabase
    .from("photospot_reviews")
    .update({
      text: reviewInfo.text,
      rating: parseInt(reviewInfo.rating),
    })
    .eq("id", reviewId)
    .select("*")
    .single();
  if (uploadError) {
    console.log("insert error: ", uploadError);
    redirect("error?error=" + uploadError.message);
    // return { message: `Failed saving data ${formInfo.name},` + resp.error }
  }

  console.log("successfully edited", uploadData);
  return uploadData;
}
