"use server"
import { editPhotobookPictureSchema } from "@/components/photobook/editPhotobookPicture";
import { PhotobookPicture, Review } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { randomNumber } from "@/utils/common/math";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PHOTO_BUCKET = "photospot_pictures";
export default async function editPhotobookPicture(photobookPictureId: number, photobookPictureInfo: z.infer<typeof editPhotobookPictureSchema>, photospot_id: number, photobookPictures: FormData): Promise<PhotobookPicture> {

    if (!photobookPictureInfo || !photobookPictureId) {
        redirect('/error?error=missing info for edit');
    }

    console.log('photobookPictureInfo', photobookPictureInfo);
    const supabase = createClient()
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        redirect('/error?error=not logged in');
    }

    // need to handle removing old photos here fromt he bucket
    if (photobookPictureInfo?.photosToRemove && photobookPictureInfo.photosToRemove.length > 0) {
        let photo_path = photobookPictureInfo.photosToRemove.map((name: string) => photospot_id + '/photobook/' + photobookPictureId + '/' + name);
        console.log('removing', photo_path);
        const { error } = await supabase.storage.from(PHOTO_BUCKET).remove(photo_path);
        if (error) {
            redirect('/error?error=' + error.message);
        }
    }


    let filePaths: string[] = [];
    const photoData: any[] = photobookPictures.getAll('photobook_pictures');
    if (photoData) {
        const fileUploadPromiseArray = photoData.map((photo) => {
            //maybe have lookup when uploading image to see if it exists already 
            let photo_path = photospot_id + '/photobook/' + photobookPictureId + '/' + photo.name;
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
    }
    if (photobookPictureInfo.currentPhotos) {
        console.log('fixing photo path');
        filePaths = filePaths.concat(photobookPictureInfo.currentPhotos);
    }
    const { data: uploadData, error: uploadError } = await supabase
        .from('photospots_photobook_pictures')
        .update({
            name: photobookPictureInfo.name,
            description: photobookPictureInfo.description,
            photo_paths: filePaths,
        }).eq('id', photobookPictureId).select('*').single();
    if (uploadError) {
        console.log("insert error: ", uploadError);
        redirect('error?error=' + uploadError.message);
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }

    console.log("successfully uploaded", uploadData);
    return uploadData;
}