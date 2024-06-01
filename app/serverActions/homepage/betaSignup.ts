'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
export async function betaSignup(email: string) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    let query = supabase.from('betaEmailList').insert({ email: email });
    const { data, error } = await query;
    if (error) {
        redirect('/error?error=' + error.message);
    }
    //todo add photospot type
    return;
}

