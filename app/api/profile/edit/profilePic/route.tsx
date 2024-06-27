"use server"

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export default async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.formData();
    const photo = formData.get('photo') as File;
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        console.log('no user logged in');
        return new Response(JSON.stringify({ error: 'missing user' }), { status: 400 })
    }
    //checks if user is private
    const { data: isPrivate, error: privateError } = await supabase.from('profiles').select('private').eq('id', user.data.user.id).single();
    if (privateError) {
        console.log('error', privateError);
        return new Response(JSON.stringify({ error: 'gettting private' }), { status: 500 })
    }
    let pre_path = 'public';
    if (isPrivate?.private) {
        pre_path = 'private';
    }
    let fileType = photo.name.split('.').pop();
    //uploads photo to correct folder
    const { error: profilePicError } = await supabase.storage.from('profile_pics').upload(`${pre_path}/${user.data.user.id}.${fileType}`, photo, { upsert: true })
    if (profilePicError) {
        console.log('error', profilePicError);
        return new Response(JSON.stringify({ error: 'uploading profile pic' }), { status: 500 })
    }
    const url = supabase.storage.from('profile_pics').getPublicUrl(`${pre_path}/${user.data.user.id}.${fileType}`);
    return NextResponse.json(url.data.publicUrl);
}