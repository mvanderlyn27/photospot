"use server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.log('error', error);
        return new Response(JSON.stringify({ error: 'missing user' }), { status: 400 })
    }
    const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
    //maybe create new user object which stores user/profile info
    if (profileError) {
        console.log('error', profileError);
        return new Response(JSON.stringify({ error: 'gettting profile' }), { status: 500 })
    }
    return NextResponse.json({ ...data.user, ...profile });
}