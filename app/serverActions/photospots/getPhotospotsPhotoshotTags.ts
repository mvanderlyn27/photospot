//get photoshots tags for a photospot, then display highest quantity tags (based on user votes)

'use server'

import { Photoshot } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getPhotoshotTags } from "../photoshots/getPhotoshotTags";
const TAG_COUNT = 5;

export async function getPhotospotsPhotoshotTags(photospotId: number): Promise<string[]> {
    const supabase = createClient()
    //Need to get all photoshots for a photospot, and display highest quantity tags 
    const { data: photospotData, error: photospotError } = await supabase.from('photoshots').select(`*`).eq('photospot_id', photospotId);
    if (photospotError) {
        redirect('/error?error=' + photospotError.message);
    }
    //need to revisit how we select tags
    const promiseArray = photospotData.map(photoshot => getPhotoshotTags(photoshot.id))
    let out = await Promise.all(promiseArray).then(photoshotTagArrays => {
        return Array.from(new Set(photoshotTagArrays.flat()));
    }).catch(tagError => {
        redirect('/error?error=' + tagError.message);
    });
    console.log('got tags', out);
    //get 5 tags
    return out.slice(0, TAG_COUNT);
}