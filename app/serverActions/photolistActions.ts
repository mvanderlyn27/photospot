'use server'
import { cookies } from 'next/headers'
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from '@/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';
//get all photolists
export async function getPhotolist(){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').select('*');
    if(error){}

}
//get photolist by id
export async function getPhotolistById(photolist_id: number){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').select('*').eq('id',photolist_id);
}
async function searchPhotolistsByName(search_string: string){
    //search by string
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').select("*").textSearch('name',search_string); //defaults to websearch and english
    if(error){
        throwError(error);
        return error;
     }
    return data;
}
async function searchPhotolistsByLocation(lat: number, lng: number, maxDistance: number){ //in meters
    const supabase = createServerActionClient<Database>({ cookies });
    //@ts-expect-error
    //need to make this function in supabase, to select on photolists table
    const {data, error} = await supabase.rpc("nearby_photolists", { lat: lat, long: lng, }).select("*").lte('distance_meters', maxDistance);
    if(error){
       throwError(error);
       return error;
    }
    return data;
    
}
export async function updatePhotolist(photolist_id: number, update_data: any){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').update(update_data).eq('id',photolist_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//create photolist
export async function createPhotolist(photolist_data: any){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').insert(photolist_data);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//delete photolist
export async function deletePhotolist(photolist_id: number){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photolists').delete().eq('id',photolist_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//get photospots from a photolist id
export async function getPhotospotsFromPhotolist(photolist_id: number){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').select('photospots').eq('id', photolist_id);
    if(error){
        throwError(error);
        return error;
    }
    let photospots_response = await supabase.from('photospots').select('*').containedBy('id', data);
    if(photospots_response.error){
        throwError(photospots_response.error);
        return photospots_response.error;
    }
    return photospots_response.data;
}

function throwError(error:PostgrestError){
    console.log("error searching data", error);
}
