"use server"
import { createReviewSchema } from "@/components/review/createReviewDialog";
import { Review } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { randomNumber } from "@/utils/common/math";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PHOTO_BUCKET = "review_pictures";
export default async function createReview(reviewInfo: z.infer<typeof createReviewSchema>, photospot_id: number): Promise<Review> {

    if (!reviewInfo) {
        redirect('/error');
    }
    const supabase = createClient()
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        redirect('/error?error=not logged in');
    }
    const { data: uploadData, error: uploadError } = await supabase
        .from('photospot_reviews')
        .upsert([{
            created_by: user.data.user.id,
            photospot_id: photospot_id,
            text: reviewInfo.text,
            rating: reviewInfo.rating
        }]).select('*').single();
    if (uploadError) {
        console.log("insert error: ", uploadError);
        redirect('error?error=' + uploadError.message);
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }

    return uploadData;
}