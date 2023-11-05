'use server'
import { cookies } from 'next/headers'
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from '@/types/supabase';
import { PostgrestError } from '@supabase/supabase-js';

//get all photolists
export async function getPhotolist(){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').select('*');
    if(error){
        throwError(error);
     }
    return data;

}

//get photolist by id
export async function getPhotolistById(photolist_id: number){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').select('*').eq('id',photolist_id);
    if(error){
        throwError(error);
        return error;
     }
    return data;

}

//Search via name (works)
export async function searchPhotolistsByName(search_string: string){
    //search by string
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').select("*").textSearch('name',search_string); //defaults to websearch and english
    if(error){
        throwError(error);
        return error;
     }
    return data;
}

//search via location, DOESN'T WORK YET
export async function searchPhotolistsByLocation(lat: number, lng: number, maxDistance: number){ //in meters
    const supabase = createServerActionClient<Database>({ cookies });
    //@ts-expect-error
    //need to make this function in supabase, to select on photolists table, probably average distance away from user for all photospots
    const {data, error} = await supabase.rpc("nearby_photolists", { lat: lat, long: lng, }).select("*").lte('distance_meters', maxDistance);
    if(error){
       throwError(error);
       return error;
    }
    return data;
}

//update photolist fields
export async function updatePhotolist(photolist_id: number, update_data: any){
    const supabase = createServerActionClient<Database>({ cookies });
    const {error} = await supabase.from('photolists').update(update_data).eq('id',photolist_id);
    if(error){
        console.log(error);
        return error;
    }
}
//create photolist
export async function createPhotolist(photolist_data: any){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').upsert(photolist_data);
    if(error){
        console.log(error);
    }
    return {id: data?.id, error: error};;
}

//delete photolist
export async function deletePhotolist(photolist_id: number){
    const supabase = createServerActionClient({ cookies });
    const res1 = await supabase.from('photolists').delete().eq('id',photolist_id);
    if(res1.error){
        console.log(res1.error);
        return res1.error;
    }
    const res2 = await supabase.from('photolist_photospots').delete().eq('photolist',photolist_id);
    if(res2.error){
        console.log(res2.error);
        return res2.error;
    }
    return null;
}

//tbd better error handeling 
function throwError(error:PostgrestError){
    console.log("error searching data", error);
}
