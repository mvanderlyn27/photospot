'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Photospot, PhotospotStats } from '@/types/photospotTypes'
export async function getPhotospotById(id: number): Promise<Photospot> {
    const supabase = createClient()
    const { data, error } = await supabase.rpc('get_photospot_by_id_lat_lng', { 'input_id': id }).select('*').single();
    // const { data, error } = await supabase.from('profiles').select('username, ...photospots(*)').eq('id', id);
    if (error) {
        redirect('/error?error=' + error.message);
    }
    return data;
}

export async function getPhotospotByIdStats(id: number): Promise<PhotospotStats> {
    const supabase = createClient()
    const { data, error } = await supabase.from('photospot_rating_stats').select('*').eq('id', id).single();
    // const { data, error } = await supabase.from('profiles').select('username, ...photospots(*)').eq('id', id);
    if (error) {
        redirect('/error?error=' + error.message);
    }
    return data;
}