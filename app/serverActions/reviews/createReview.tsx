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
export default async function createReview(reviewInfo: z.infer<typeof createReviewSchema>, photospot_id: number, reviewPictures: FormData): Promise<Review> {

    if (!reviewInfo || !reviewInfo.photos) {
        redirect('/error');
    }
    const supabase = createClient()
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        redirect('/error?error=not logged in');
    }
    const { data: uploadData, error: uploadError } = await supabase
        .from('photospot_reviews')
        .insert([{
            created_by: user.data.user.id,
            photospot_id: photospot_id,
            text: reviewInfo.text,
            photo_paths: [],
            rating: reviewInfo.rating
        }]).select('*');
    if (uploadError) {
        console.log("insert error: ", uploadError);
        redirect('error?error=' + uploadError.message);
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }

    let filePaths: string[] = [];
    const photoData: any[] = reviewPictures.getAll('review_pictures');
    const fileUploadPromiseArray = photoData.map((photo) => {
        //maybe have lookup when uploading image to see if it exists already 
        let photo_path = 'photospots/' + photospot_id + '/' + uploadData[0].id + '/' + photo.name;
        return supabase.storage.from(PHOTO_BUCKET).upload(photo_path, photo, { upsert: true });
    });
    await Promise.all(fileUploadPromiseArray).then((results) => {
        results.forEach((result) => {
            if (result.error) {
                redirect('/error?error=' + result.error.message);
            }
            filePaths.push(result.data.path);
        })
    });

    filePaths = filePaths.map((path) => supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl);
    console.log('filepaths', filePaths);
    const photo_path_update = { photo_paths: filePaths }
    const { data: reviewWithPhotoPath, error: updatePhotopathError } = await supabase.from('photospot_reviews').update(photo_path_update).eq('id', uploadData[0].id).select('*');
    if (updatePhotopathError) {
        console.log("update error: ", updatePhotopathError);
        redirect('/error?=error updating review');
    }
    revalidatePath('/')
    console.log("successfully uploaded", reviewWithPhotoPath);
    return reviewWithPhotoPath[0];
}