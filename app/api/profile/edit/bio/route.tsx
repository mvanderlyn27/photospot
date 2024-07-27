import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { bio } = body;
    if (!bio) {
        return new Response(JSON.stringify({ error: 'missing bio' }), { status: 400 })
    }
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        console.log('no user logged in');
        return new Response(JSON.stringify({ error: 'missing user' }), { status: 400 })
    }
    const { data, error } = await supabase.from('profiles').update({ bio: bio }).eq('id', user.data.user.id).select('bio').single();
    if (error) {
        console.log('error', error);
        return new Response(JSON.stringify({ error: 'updating username' }), { status: 500 })
    }
    console.log("data", data);
    return NextResponse.json(data.bio);
}