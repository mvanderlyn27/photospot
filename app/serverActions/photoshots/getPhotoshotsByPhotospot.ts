'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
export async function getPhotoshotsByPhotospot(photospot_id: number) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    let query = supabase.from('photoshots').select('*, ...profiles!photoshots_created_by_fkey(username)').eq('photospot_id', photospot_id);
    const { data, error } = await query;
    if (error) {
        console.log('error', error);
        redirect('/error?error=' + error.message);
    }
    //todo add photospot type
    return data;
}
