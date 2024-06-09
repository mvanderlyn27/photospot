import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";


const PHOTO_BUCKET = "photoshot_pictures";
export async function DELETE(
    request: Request,
    { params }: { params: { id: number } }
) {
    const photoshotId = params.id;
    const supabase = createClient()
    const { data: photoshot, error: photoshotError } = await supabase.from('photoshots').select('*').eq('id', photoshotId).single();
    if (photoshotError || !photoshot) {
        console.log("photoshot error", photoshotError);
        return new Response("issue getting photoshot to delete", { status: 500 });
    }
    const photospotId = photoshot.photospot_id;
    console.log('deleting photoshot', photoshotId);

    const { error: deleteError } = await supabase
        .from('photoshots')
        .delete()
        .eq('id', photoshotId);
    if (deleteError) {
        console.log("delete error: ", deleteError);
        return new Response("issue deleting", { status: 500 });
    }
    // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    const { data: photoshotPhotoListData, error: listError } = await supabase.storage.from(PHOTO_BUCKET).list(`${photospotId}/${photoshotId}/`);
    if (listError) {
        console.log("list error: ", listError);
        return new Response("issue getting list", { status: 500 });
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }
    const photoshotPhotoList = photoshotPhotoListData?.map((item) => photospotId + '/' + photoshotId + '/' + item.name)
    const { error: deletePhotosError } = await supabase
        .storage.from(PHOTO_BUCKET)
        .remove(photoshotPhotoList)
    if (deletePhotosError) {
        console.log("delete error: ", deletePhotosError);
        return new Response("issue deleting photos", { status: 500 });
    }
    console.log('success deleting', photoshotId);
    return NextResponse.json('success')
}