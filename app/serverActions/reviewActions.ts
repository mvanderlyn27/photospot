'use server'
import { cookies } from 'next/headers'
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";

export async function createPhotospotReviewFromForm(){

}
export async function createPhotolistReviewFromForm(){

}

export async function createPhotospotReview(review_id: number, insert_data: any){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photospot_reviews').insert(insert_data);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}

export async function createPhotolistReview(review_id: number, insert_data: any){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photolist_reviews').insert(insert_data);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}

//get reviews for a photospot
export async function getPhotospotReviews(photospot_id: number){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photospot_reviews').select('*').eq('review_target',photospot_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//get reviews for a photolist
export async function getPhotolistReviews(photolist_id: number){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photolist_reviews').select('*').eq('review_target',photolist_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//list all reviews for photospots for a user
export async function getUsersPhotospotReviews(photospot_id: number){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photolist_reviews').select('*').eq('created_by',photospot_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//list all reviews for photolists for a user
export async function getUsersPhotolistReviews(photolist_id: number){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photolist_reviews').select('*').eq('created_by',photolist_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//delete a photospot review
export async function deletePhotospotReview(review_id: number){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photospot_reviews').delete().eq('id',review_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//delete a photolist review
export async function deletePhotolistReview(review_id: number){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photolist_reviews').delete().eq('id',review_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//update a photospot review
export async function updatePhotospotReview(review_id: number, update_data: any){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photospot_reviews').update(update_data).eq('id',review_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}
//update a photolist review
export async function updatePhotolistReview(review_id: number, update_data: any){
    const supabase = createServerActionClient({ cookies });
    const {data, error} = await supabase.from('photolist_reviews').update(update_data).eq('id',review_id);
    if(error){
        console.log(error);
        return error;
    }
    return data;
}

