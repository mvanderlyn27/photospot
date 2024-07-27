"use server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.log('error getting user', error);
        return new Response(JSON.stringify({ error: 'missing user' }), { status: 400 })
    }
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
    //maybe create new user object which stores user/profile info
    if (profileError) {
        console.log('error getting profile', profileError);
        return new Response(JSON.stringify({ error: 'gettting profile' }), { status: 500 })
    }

    const { data: profilePriv, error: profilePrivError } = await supabase.from('profiles_priv').select('*').eq('id', data.user.id).maybeSingle();
    if (profilePrivError) {
        console.log('error getting priv profile', profilePrivError);
        return new Response(JSON.stringify({ error: 'gettting profile' }), { status: 500 })
    }
    const out = { ...data.user, ...profilePriv, ...profile };
    return NextResponse.json(out);
}