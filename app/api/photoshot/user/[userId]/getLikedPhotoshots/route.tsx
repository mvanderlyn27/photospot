"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const PAGE_SIZE = 20;
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    const searchParams = req.nextUrl.searchParams;
    if (!params.userId) {
        // return new Response(JSON.stringify({ error: 'missing user id' }), { status: 400 })
        console.log('missing user id');
        return new Error("missing user id", { cause: 400 })

    }

    const supabase = createClient();
    const { data: likedPhotoshotIds, error: likedPhotoshotIdsError } = await supabase.from('photoshot_likes').select('photoshot_id').eq('created_by', params.userId).eq('like_type', 1);
    if (likedPhotoshotIdsError) {
        console.log('error', likedPhotoshotIdsError);
        return new Response(JSON.stringify({ error: 'gettting liked photoshot list' }), { status: 500 })
    }
    let pageCountRaw = searchParams.get('pageCount');
    let pageCount = 1;
    if (pageCountRaw) {
        pageCount = parseInt(pageCountRaw);
    }

    const { data, error } = await supabase.from('photoshots').select('*').in('id', likedPhotoshotIds.map((photoshot) => photoshot.photoshot_id)).order('created_at', { ascending: false }).range((PAGE_SIZE * (pageCount - 1)), PAGE_SIZE * pageCount);
    if (error) {
        console.log('error', error);
        return new Response(JSON.stringify({ error: 'gettting photoshots' }), { status: 500 })
    }
    console.log('data', data);
    return NextResponse.json(data);
}