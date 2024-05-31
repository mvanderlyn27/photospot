"use server"

import { PhotobookPicture } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const PHOTO_BUCKET = "photospot_pictures";
export default async function deletePhotobookPicture(photobookPicture: PhotobookPicture): Promise<void> {
    const photobookPictureId = photobookPicture.id;
    const photospotId = photobookPicture.photospot_id;
    console.log('deleting photobookPicture', photobookPictureId);
    if (!photobookPictureId) {
        redirect('/error?error=missing info for delete');
    }

    const supabase = createClient()
    const { error: deleteError } = await supabase
        .from('photospots_photobook_pictures')
        .delete()
        .eq('id', photobookPictureId);
    if (deleteError) {
        console.log("delete error: ", deleteError);
        redirect('error?error=' + deleteError.message);
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }
    const { data: photobookPicturePhotoListData, error: listError } = await supabase.storage.from(PHOTO_BUCKET).list(`${photospotId}/photobook/${photobookPictureId}/`);
    if (listError) {
        console.log("list error: ", listError);
        redirect('error?error=' + listError.message);
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }
    const photobookPicturePhotoList = photobookPicturePhotoListData?.map((item) => photospotId + '/photobook/' + photobookPictureId + '/' + item.name)
    console.log('photobookPicturePhotoList', photobookPicturePhotoList);
    const { error: deletePhotosError } = await supabase
        .storage.from(PHOTO_BUCKET)
        .remove(photobookPicturePhotoList)
    if (deletePhotosError) {
        console.log("delete error: ", deletePhotosError);
        redirect('error?error=' + deletePhotosError.message);
    }
    console.log('successfully deleted', photobookPictureId);
    return
}
