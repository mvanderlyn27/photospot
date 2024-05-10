'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
import { fileURLToPath } from 'url'
export async function getTestImages(): Promise<string[]> {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs

    const { data, error } = await supabase.storage.from('website_pictures').list('testing');
    if (error) {
        redirect('/error?error=' + error.message);
    }
    let fileUrls: string[] = [];
    data.forEach(file => {
        fileUrls.push(supabase.storage.from('website_pictures/testing').getPublicUrl(file.name).data.publicUrl);
    })
    //todo add photospot type
    return fileUrls;

}