'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
export async function savePhotospot(photospotId: number): Promise<void> {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        redirect('/error?error=not logged in');
    }
    const data = {
        id: user.data.user.id,
        photospot: photospotId

    };
    const { error } = await supabase.from('saved_photospots').upsert(data);
    if (error) {
        redirect('/error?error=' + error.message);
    }
    //todo add photospot type
}