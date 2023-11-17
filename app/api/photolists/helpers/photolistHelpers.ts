"use server"
import { Database } from "@/types/supabase";
import { SupabaseClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function updatePhotolistsPhotospots(photolist_id: number, desired_photospot_list: number[], supabaseInput: SupabaseClient | undefined ){
    //select all photolist-> photospot pairings
    //find differences between input, update updates, remove old things

    const supabase = supabaseInput? supabaseInput : createRouteHandlerClient<Database>({ cookies });
    const {data, error} = await supabase.from('photolist_photospots').select('*').eq('photolist', photolist_id);
    if(error){
        console.log('update bridge error: ', error);
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
    console.log('photolist to add',photospots_to_add,' photospots to delete', photospots_to_delete)
    if(photospots_to_add.length){
        const error_add = await addPhotolistPhotospotsLinks(photolist_id, photospots_to_add, supabase);
        if(error_add) return error_add;
        }
    if(photospots_to_delete){
        const error_delete = await deletePhotolistPhotospotsLinks(photolist_id, photospots_to_delete, supabase);
        if(error_delete)return error_delete;
    }
} 

export async function addPhotolistPhotospotsLinks(photolist_id: number, photospot_ids: number[], supabaseInput: SupabaseClient | undefined){
    const supabase = supabaseInput? supabaseInput : createRouteHandlerClient<Database>({ cookies });
        for(const photospot_id of photospot_ids){ 
        const { error} = await supabase.from('photolist_photospots').insert({photolist: photolist_id ,photospot: photospot_id});
        if(error){
            console.log(error);
            return error;
        }
    }
        //need to figure out data return here
}

export async function deletePhotolistPhotospotsLinks(photolist_id: number, photospot_ids: number[], supabaseInput: SupabaseClient | undefined){
    const supabase = supabaseInput? supabaseInput : createRouteHandlerClient<Database>({ cookies });
    const { error } = await supabase.from('photolist_photospots').delete().eq('photolist', photolist_id).in('photospot', photospot_ids);
    if(error){
        console.log(error);
        return error;
    }
}

export async function deletePhotolistLinks(photolist_id: number, supabaseInput: SupabaseClient | undefined){
    const supabase = supabaseInput? supabaseInput : createRouteHandlerClient<Database>({ cookies });
    const {error} = await supabase.from('photolist_photospots').delete().eq('photolist', photolist_id)
    if(error){
        return error;
    }
}