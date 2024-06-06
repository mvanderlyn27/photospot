"use server"

import { Photoshot } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const PHOTO_BUCKET = "photoshot_pictures";
export default async function deletePhotobookPicture(photoshot: Photoshot): Promise<void> {
    const photoshotId = photoshot.id;
    const photospotId = photoshot.photospot_id;
    console.log('deleting photoshot', photoshotId);
    if (!photoshotId) {
        redirect('/error?error=missing info for delete');
    }

    const supabase = createClient()
    const { error: deleteError } = await supabase
        .from('photoshots')
        .delete()
        .eq('id', photoshotId);
    if (deleteError) {
        console.log("delete error: ", deleteError);
        redirect('error?error=' + deleteError.message);
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }
    const { data: photoshotPhotoListData, error: listError } = await supabase.storage.from(PHOTO_BUCKET).list(`${photospotId}/${photoshotId}/`);
    if (listError) {
        console.log("list error: ", listError);
        redirect('error?error=' + listError.message);
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }
    const photoshotPhotoList = photoshotPhotoListData?.map((item) => photospotId + '/' + photoshotId + '/' + item.name)
    console.log('photoshotPhotoList', photoshotPhotoList);
    const { error: deletePhotosError } = await supabase
        .storage.from(PHOTO_BUCKET)
        .remove(photoshotPhotoList)
    if (deletePhotosError) {
        console.log("delete error: ", deletePhotosError);
        redirect('error?error=' + deletePhotosError.message);
    }
    console.log('successfully deleted', photoshotId);
    return
}
