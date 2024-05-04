'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
export async function listAllPhotospots() {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs

    const bucket = "photospot_pictures";
    const resp = await supabase.from('photospots').select('*');
    if (resp.error) {
        redirect('/error?error=' + resp.error.message);
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