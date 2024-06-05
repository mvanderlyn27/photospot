'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot } from '@/types/photospotTypes'
export async function getPhotospotTags(photospotId: number): Promise<string[]> {
    const supabase = createClient()


    //Need to get all photoshots for a photospot, and display highest quantity tags 

    // const { data, error } = await supabase.from('photoshot_tags').select(`id, tags(name)`).eq('id', photospotId);
    // if (error) {
    // redirect('/error?error=' + error.message);
    // }
    // const out = data.map((obj: any) => obj.tags.name)
    // console.log(out);
    const test_out = ["Golden hour", "lmaoo", "need to get this working"];
    return test_out
}