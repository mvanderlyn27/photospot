//Get a user's profile based on URL
"use server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET({ params }: { params: { userId: string } }) {
    const supabase = createClient();
    const user = await supabase.auth.getUser();

    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', params.userId).single();
    //maybe create new user object which stores user/profile info
    if (profileError) {
        console.log('error', profileError);
        return new Response(JSON.stringify({ error: 'gettting profile' }), { status: 500 })
    }
    if (!profile) {
        return new Response(JSON.stringify({ error: 'user not found' }), { status: 404 })
    }
    if (profile.private_profile === true && profile.id !== user.data.user?.id) {
        return new Response(JSON.stringify({ error: 'user is private' }), { status: 403 })
    }
    return NextResponse.json(profile);
}