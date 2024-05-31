"use server"

import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const PHOTO_BUCKET = "photospot_pictures";
export default async function deletePhotospot(photospotId: number): Promise<void> {
    console.log('deleting photospot', photospotId);
    if (!photospotId) {
        redirect('/error?error=missing info for delete');
    }

    const supabase = createClient()
    const { error: deleteError } = await supabase
        .from('photospots')
        .delete()
        .eq('id', photospotId);
    if (deleteError) {
        console.log("delete error: ", deleteError);
        redirect('error?error=' + deleteError.message);
        // return { message: `Failed saving data ${formInfo.name},` + resp.error }
    }
    deletePhotospotPictures(supabase, photospotId);
    console.log('successfully deleted', photospotId);
    return
}

async function deletePhotospotPictures(supabase: SupabaseClient, photospotId: number) {
    let pathsToRemove: string[] = [];

    //Get all folders under photospot/photobook
    //could be done in parallel as well
    const { data: photospotPhotoListData, error: listErrorPhotospot } = await supabase.storage.from(PHOTO_BUCKET).list(`${photospotId}/`);
    const { data: photospotPhotobookFolderData, error: listErrorPhotobook } = await supabase.storage.from(PHOTO_BUCKET).list(`${photospotId}/photobook/`);
    if (listErrorPhotospot || listErrorPhotobook) {
        console.log("list error: ", listErrorPhotospot?.message, listErrorPhotobook?.message);
        redirect('error?error=' + listErrorPhotospot?.message + ' ' + listErrorPhotobook?.message);
    }

    //add photospot pictures already, don't need any more info for them
    photospotPhotoListData?.forEach((item) => { if (item.id) { pathsToRemove.push(photospotId + '/' + item.name) } })
    //build array of promises to list, and add all files to pathsToRemove
    const photospotPhotobookFolders = photospotPhotobookFolderData?.map((item) => photospotId + '/photobook/' + item.name)
    const promiseArray = photospotPhotobookFolders.map(async (folder) => {
        const { data: FileData, error: FolderError } = await supabase.storage.from(PHOTO_BUCKET).list(folder);
        if (FolderError) {
            console.log("list error: ", FolderError);
            redirect('error?error=' + FolderError.message);
            // return { message: `Failed saving data ${formInfo.name},` + resp.error }
        }
        return FileData?.map((item) => folder + '/' + item.name)
    });
    //execute promise to add all files to paths to remove
    await Promise.all(promiseArray).then((data) => { data.forEach((item) => pathsToRemove = pathsToRemove.concat(item)) });   // const photospotPhotoList = photospotPhotoListData?.map((item) => photospotId + '/' + item.name)
    console.log('pathsToRemove', pathsToRemove);
    supabase.storage.from(PHOTO_BUCKET).remove(pathsToRemove);
    console.log('deleted all pictures for', photospotId)

}