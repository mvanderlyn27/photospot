"use server"

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

const PHOTO_BUCKET = "profile_pictures";
export async function POST(req: Request) {
    const supabase = createClient();
    const formData = await req.formData();
    const photo = formData.get('photo') as File;
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        console.log('no user logged in');
        return new Response(JSON.stringify({ error: 'missing user' }), { status: 400 })
    }
    //checks if user is private
    const { data: isPrivate, error: privateError } = await supabase.from('profiles').select('private_profile').eq('id', user.data.user.id).single();
    if (privateError) {
        console.log('error getting private info', privateError);
        return new Response(JSON.stringify({ error: 'gettting private' }), { status: 500 })
    }
    let pre_path = 'public';
    if (isPrivate?.private_profile) {
        pre_path = 'private';
    }
    let fileType = photo.name.split('.').pop();
    //uploads photo to correct folder
    const { error: profilePicError } = await supabase.storage.from(PHOTO_BUCKET).upload(`${pre_path}/${user.data.user.id}.${fileType}`, photo, { upsert: true })
    if (profilePicError) {
        console.log('error uploading profile pic', profilePicError);
        return new Response(JSON.stringify({ error: 'uploading profile pic' }), { status: 500 })
    }

    const url = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(`${pre_path}/${user.data.user.id}.${fileType}?timestamp=${Date.now()}`);
    const { error: profileUpdateError } = await supabase.from('profiles').update({ photo_path: url.data.publicUrl }).eq('id', user.data.user.id);
    if (profileUpdateError) {
        console.log('error updating profile', profileUpdateError);
        return new Response(JSON.stringify({ error: 'updating profile path' }), { status: 500 })
    }
    return NextResponse.json(url.data.publicUrl);
}