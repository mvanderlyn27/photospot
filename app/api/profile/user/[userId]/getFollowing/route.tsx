"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const PAGE_SIZE = 20;
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const searchParams = req.nextUrl.searchParams;
    if (!params.userId) {
        return new Response(JSON.stringify({ error: 'missing user id' }), { status: 400 })
    }

    const supabase = createClient();
    const { data: followedUserIds, error: followIdError } = await supabase.from('user_follows').select('followee').eq('follower', params.userId);
    if (followIdError) {
        console.log('error', followIdError);
        return new Response(JSON.stringify({ error: 'gettting liked photoshot list' }), { status: 500 })
    }
    let pageCountRaw = searchParams.get('pageCount');
    let pageCount = 1;
    if (pageCountRaw) {
        pageCount = parseInt(pageCountRaw);
    }
    const { data, error } = await supabase.from('profiles').select('*').in('id', followedUserIds.map((user) => user.followee)).order('created_at', { ascending: false }).range((PAGE_SIZE * (pageCount - 1)), PAGE_SIZE * pageCount);

    if (error) {
        console.log('error', error);
        return new Response(JSON.stringify({ error: 'gettting photoshots' }), { status: 500 })
    }
    console.log('following', data);
    return NextResponse.json(data);
}