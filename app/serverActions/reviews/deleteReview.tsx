"use server"
import { editPhotobookPictureSchema } from "@/components/photobook/editPhotobookPicture";
import { editReviewSchema } from "@/components/review/editReviewDialog";
import { PhotobookPicture, Review } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { randomNumber } from "@/utils/common/math";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
export default async function deleteReview(reviewId: number,): Promise<void> {

    if (!reviewId) {
        redirect('/error?error=missing info for delete');
    }

    const supabase = createClient()
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        redirect('/error?error=not logged in');
    }

    // need to handle removing old photos here fromt he bucket

    const { error: deleteError } = await supabase
        .from('photospot_reviews')
        .delete()
        .eq('id', reviewId);
    if (deleteError) {
        console.log("insert error: ", deleteError);
        redirect('error?error=' + deleteError.message);
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }

    console.log("successfully deleted", reviewId);
    return;
}