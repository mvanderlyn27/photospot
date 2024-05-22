'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
export async function getSavedPhotospot(): Promise<{ id: number, photospot: number }[]> {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        redirect('/error?error=not logged in');
    }
    const { data, error } = await supabase.from('saved_photospots').select('*').eq('id', user.data.user.id).eq('id', user.data.user.id);
    if (error) {
        redirect('/error?error=' + error.message);
    }
    return data
    //todo add photospot type
}