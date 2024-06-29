
//needs to update profile field, location of profile pic, and path or profile pic
"use server"

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { private_profile } = body;
    if (private_profile === undefined) {
        return new Response(JSON.stringify({ error: 'missing value' }), { status: 500 })
    }
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        console.log('no user logged in');
        return new Response(JSON.stringify({ error: 'missing user' }), { status: 400 })
    }

    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.data.user.id).single();
    if (profileError) {
        console.log('error getting profile', profileError);
        return new Response(JSON.stringify({ error: 'gettting profile' }), { status: 500 })
    }
    let updateInfo: any = { id: user.data.user.id, private_profile: private_profile };
    if (profile.photo_path) {
        //if profile pic, move it to correct folder
        const oldPath = `${profile.private_profile}/${user.data.user.id}.${profile.photo_path.split('.').pop()}`;
        const newPath = `${private_profile}/${user.data.user.id}.${profile.photo_path.split('.').pop()}`;
        const { error: storageError } = await supabase.storage.from('profile_pictures').copy(oldPath, newPath);
        if (storageError) {
            console.log('error moving profile pic', storageError);
            return new Response(JSON.stringify({ error: 'moving profile pic' }), { status: 500 })
        }
        const newUrl = supabase.storage.from('profile_pictures').getPublicUrl(newPath).data.publicUrl;
        updateInfo = { ...updateInfo, photo_path: newUrl };
    }
    //update profile to have correct info
    const { data, error } = await supabase.from('profiles').upsert(updateInfo).select('*').single();
    if (error) {
        console.log('error updating email', error);
        return new Response(JSON.stringify(error.message), { status: 500 });
    }
    console.log('data', data);
    return NextResponse.json(data);
}