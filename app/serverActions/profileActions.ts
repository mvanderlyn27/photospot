'use server'
import { cookies } from 'next/headers'
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

//get user profile
export async function getProfile(profile_id: number, update_data: any){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photolist_reviews').update(update_data).eq('id',profile_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}

//update profile info
export async function updateProfile(profile_id: number, update_data: any){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photolist_reviews').update(update_data).eq('id',profile_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//delete user
export async function deleteProfile(profile_id: number, update_data: any){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photolist_reviews').update(update_data).eq('id',profile_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}