"use server"
import { z } from 'zod'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Database } from '../../types/supabase'
import { PostgrestError } from '@supabase/supabase-js'
import { Photospot } from '../../types/photospotTypes'
//delete based on id & photo_paths
export async function deletePhotoSpot(id: number, photo_paths: string[]) {
    const supabase = createServerActionClient<Database>({ cookies });
    supabase.storage.from('photospots_pictures').remove(photo_paths);
    supabase.from('photospots').delete().eq('id', id);
}
export async function listPhotoSpots() {
    const supabase = createServerActionClient<Database>({ cookies });
    const bucket = "photospot_pictures";
    const resp = await supabase.from('photospots').select('*');
    if (resp.error) {
        return resp.error
    }
    //todo add photospot type
    let photospot_list: Photospot[] = [];
    resp.data.forEach((photospot: any) => {
        const url = supabase.storage.from(bucket).getPublicUrl(photospot.photo_paths[0]) //only using first photo for now 
        photospot_list.push({
            ...photospot,
            photo_path: url.data.publicUrl
        })
    });
    return photospot_list;
}

async function searchPhotospotsByName(search_string: string) {
    //search by string
    const supabase = createServerActionClient<Database>({ cookies });
    const { data, error } = await supabase.from('photospots').select("*").textSearch('name', search_string); //defaults to websearch and english
    if (error) {
        throwError(error);
        return error;
    }
    return data;
}
async function searchPhotospotsByLocation(lat: number, lng: number, maxDistance: number) { //in meters
    const supabase = createServerActionClient<Database>({ cookies });
    //@ts-expect-error
    const { data, error } = await supabase.rpc("nearby_photospots", { lat: lat, long: lng, }).select("*").lte('distance_meters', maxDistance);
    if (error) {
        throwError(error);
        return error;
    }
    return data;

}
function throwError(error: PostgrestError) {
    console.log("error searching data", error);
}
