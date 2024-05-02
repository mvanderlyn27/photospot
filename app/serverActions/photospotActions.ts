"use server"
import { z } from 'zod'
import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Database } from '../../types/supabase'
import { PostgrestError } from '@supabase/supabase-js'
import { Photospot } from '../../types/photospotTypes'
export async function uploadPhotoSpot(prevState: any, formData: FormData) {

    const supabase = createServerActionClient<Database>({ cookies });
    const schema = z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        photospot_picture: z.custom<File>(),
        lat: z.number().gte(-90).and(z.number().lte(90)),
        lng: z.number().gte(-180).and(z.number().lte(180))
    })
    const input = schema.parse({
        name: formData.get("name"),
        description: formData.get("description"),
        photospot_picture: formData.get("photospot_picture"),
        lat: formData.get("lat"),
        lng: formData.get("lng")
    });
    const bucket = "photospot_pictures"
    const { data, error } = await supabase.storage
        .from(bucket)
        .upload(input.name, input.photospot_picture);

    if (error) {
        if ((error as any).error == 'Duplicate') {
            console.log("file name already exists", error);
            //TODO: grab photospot link and add below
            return { message: `Photospot exists, upload your picture as a review here: ` }
        }
        console.log("photo upload error: ", error);
        return { message: `Failed storing photo ${input.name},` + error.message }
    }
    const resp = await supabase
        .from('photospots')
        .insert([{
            name: input.name,
            description: input.description,
            photo_paths: [input.name],
            location: `POINT(${input.lat},${input.lng}`
        }]);

    if (resp.error) {
        console.log("insert error: ", resp.error);
        return { message: `Failed saving data ${input.name},` + resp.error }
    }
    revalidatePath('/')

    //if no error upload photospot data to row, and link picture to new row entry 

    return { message: `Uploaded picture ${input.name}` }
}
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
