'use server'
// REWRITE all server actions AS ROUTE HANDLERS
// close to figuring it out, need to figure out if we just want client fetching
// do we want to use default fetch memoization, or swr, or react-query?
// if not client fetching, stick with sitching to route handlers? Whats the intended way to have client comp update 
// database data


import { cookies } from 'next/headers'
// need to switch to supabase/ssr https://supabase.com/docs/guides/auth/server-side/migrating-to-ssr-from-auth-helpers
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { Database } from '@/types/supabase';
import {  PostgrestError } from '@supabase/supabase-js';
import { deletePhotolistLinks } from './photolistPhotospotBridgeActions';
import { PhotolistInput, Photolist, Photospot } from '@/types/photospotTypes';
import { revalidatePath } from 'next/cache';
import { unstable_cache } from 'next/cache';

//get all photolists
export async function getPhotolists(){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').select('*');
    return {data: data, error: error};

}

//get photolist by id
export async function getPhotolistById(photolist_id: number){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').select('*').eq('id',photolist_id);
    return {data: data, error: error};

}

//Search via name (works)
export async function searchPhotolistsByName(search_string: string){
    //search by string
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').select("*").textSearch('name',search_string); //defaults to websearch and english
    return {data: data, error: error};
}

//search via location, DOESN'T WORK YET
export async function searchPhotolistsByLocation(lat: number, lng: number, maxDistance: number){ //in meters
    const supabase = createServerActionClient<Database>({ cookies });
    //@ts-expect-error
    //need to make this function in supabase, to select on photolists table, probably average distance away from user for all photospots
    const {data, error} = await supabase.rpc("nearby_photolists", { lat: lat, long: lng, }).select("*").lte('distance_meters', maxDistance);
    return {data: data, error: error};
}

//update photolist fields
export async function updatePhotolist(photolist_id: number, update_data: any, path:string){
    const supabase = createServerActionClient<Database>({ cookies });
    const {error} = await supabase.from('photolists').update(update_data).eq('id',photolist_id);
    if(error){
        console.log(error);
        return error;
    }
    revalidatePath(path);
}
//create photolist
export async function createPhotolist(photolist_data: PhotolistInput, path:string ){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolists').upsert(photolist_data).select('*');
    let id;
    if(data){
        id = data[0].id;
    }
    revalidatePath(path);
    return {id: id, error: error};;
}

//delete photolist
export async function deletePhotolist(photolist_id: number, path: string){
    const supabase = createServerActionClient({ cookies });
    const {error} = await supabase.from('photolists').delete().eq('id',photolist_id);
    if(error){
        console.log(error);
        return error;
    }
    const res1 = await deletePhotolistLinks(photolist_id);
    if(res1){
        console.log(res1);
        return res1;

    }
    revalidatePath(path);
    console.log('successfully deleted', photolist_id);
}
