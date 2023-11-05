//get photospots from a photolist id
'use server'

import { Database } from "@/types/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { PostgrestError } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function updatePhotospots(photolist_id: number, desired_photospot_list: number[]){
    //select all photolist-> photospot pairings
    //find differences between input, update updates, remove old things
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolist_photospots').select('*').eq('photolist', photolist_id);
    if(error){
        console.log(error);
        return error;
    }
    let db_photospots = data.map(row=>{return row.photospot});
    // go over all entries in current db, if they aren't in desired state, 
    // delete. If they are, remove from input, if any extra ones in desired 
    // state leftover at the end, add to the db
    let photospots_to_delete: number[] = [];
    db_photospots.forEach( entry => {
        if(desired_photospot_list.includes(entry)){
            desired_photospot_list.splice(desired_photospot_list.indexOf(entry), 1);
        }
        else{
            photospots_to_delete.push(entry);
        }
    })
    let photospots_to_add =  desired_photospot_list;
    //need to figure out error handling here
    await addPhotospots(photolist_id, photospots_to_add);
    await removePhotospots(photolist_id, photospots_to_delete);
} 

export async function addPhotospots(photolist_id: number, photospot_ids: number[]){
    const supabase = createServerActionClient<Database>({ cookies });
    photospot_ids.forEach(async photospot_id => {
        const {data, error} = await supabase.from('photolist_photospots').upsert({photolist: photolist_id ,photospot: photospot_id});
        if(error){
            console.log(error);
            return error;
        }
        //need to figure out data return here
        return data;
    });
}

export async function removePhotospots(photolist_id: number, photospot_ids: number[]){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolist_photospots').delete().eq('photolist', photolist_id).in('photospot', photospot_ids);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}

export async function getPhotospotsFromPhotolist(photolist_id: number){
    const supabase = createServerActionClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolist_photospots').select('*').eq('photolist', photolist_id);
    if(error){
        throwError(error);
        return error;
    }
    let photospots = data.map(row=>{return row.photospot});
    return photospots;
}
function throwError(error:PostgrestError){
    console.log("error searching data", error);
}
