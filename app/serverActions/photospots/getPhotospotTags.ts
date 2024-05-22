'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
export async function getPhotospotTags(photospotId: number): Promise<string[]> {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs

    const { data, error } = await supabase.from('photospot_tags').select(`id, tags(name)`).eq('id', photospotId);
    if (error) {
        redirect('/error?error=' + error.message);
    }
    const out = data.map((obj: any) => obj.tags.name)
    console.log(out);
    return out
}