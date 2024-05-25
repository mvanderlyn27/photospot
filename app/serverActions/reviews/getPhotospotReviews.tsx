'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
export async function getPhotospotReviews(photospot_id: number, user?: number) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs

    const bucket = "photospot_pictures";
    let query = supabase.from('photospot_reviews').select('*, ...profiles(username)').eq('photospot_id', photospot_id);
    if (user) {
        query = query.eq('created_by', user);
    }
    const { data, error } = await query;
    if (error) {
        redirect('/error?error=' + error.message);
    }
    //todo add photospot type
    console.log('review data', data)
    return data;
}
