import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { username } = body;
    if (!username) {
        return new Response(JSON.stringify({ error: 'missing username' }), { status: 400 })
    }
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        console.log('no user logged in');
        return new Response(JSON.stringify({ error: 'missing user' }), { status: 400 })
    }
    const { data, error } = await supabase.from('profiles').update({ username: username }).eq('id', user.data.user.id).select('username').single();
    if (error) {
        console.log('error', error);
        return new Response(JSON.stringify({ error: 'updating username' }), { status: 500 })
    }
    console.log("data", data);
    return NextResponse.json(data.username);
}