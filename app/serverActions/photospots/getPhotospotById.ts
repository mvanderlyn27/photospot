'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
export async function getPhotospotById(id: number): Promise<Photospot> {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs

    const { data, error } = await supabase.from('photospots').select('*').eq('id', id);
    if (error) {
        redirect('/error?error=' + error.message);
    }
    //todo add photospot type
    return data[0];

}