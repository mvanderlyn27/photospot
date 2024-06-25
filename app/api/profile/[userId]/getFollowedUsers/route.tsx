"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
export async function GET({ req, params }: { req: NextRequest, params: { userId: string } }) {
    if (!params.userId) {
        return new Response(JSON.stringify({ error: 'missing user id' }), { status: 400 })
    }

    const supabase = createClient();
    const { data: followedUserIds, error: followIdError } = await supabase.from('user_follows').select('followee').eq('follower', params.userId);
    if (followIdError) {
        console.log('error', followIdError);
        return new Response(JSON.stringify({ error: 'gettting liked photoshot list' }), { status: 500 })
    }
    const { data, error } = await supabase.from('profiles').select('*').in('id', followedUserIds.map((user) => user.followee));
    if (error) {
        console.log('error', error);
        return new Response(JSON.stringify({ error: 'gettting photoshots' }), { status: 500 })
    }
    return NextResponse.json(data);
}