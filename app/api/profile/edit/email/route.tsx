"use server"

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { email } = body;
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        console.log('no user logged in');
        return new Response(JSON.stringify({ error: 'missing user' }), { status: 400 })
    }
    const { data, error } = await supabase.auth.updateUser({ email: email });
    if (error) {
        console.log('error updating email', error);
        return new Response(JSON.stringify(error.message), { status: 500 });
    }
    return NextResponse.json(email);
}