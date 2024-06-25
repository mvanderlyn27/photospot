"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
export async function GET({ req, params }: { req: NextRequest, params: { userId: string } }) {
    if (!params.userId) {
        return new Response(JSON.stringify({ error: 'missing user id' }), { status: 400 })
    }

    const supabase = createClient();
    const { data: likedPhotoshotIds, error: likedPhotoshotIdsError } = await supabase.from('photoshot_likes').select('photoshot_id').eq('created_by', params.userId).eq('like_type', 1);
    if (likedPhotoshotIdsError) {
        console.log('error', likedPhotoshotIdsError);
        return new Response(JSON.stringify({ error: 'gettting liked photoshot list' }), { status: 500 })
    }
    const { data, error } = await supabase.from('photoshots').select('*').in('id', likedPhotoshotIds.map((photoshot) => photoshot.photoshot_id)).order('created_at', { ascending: false });
    if (error) {
        console.log('error', error);
        return new Response(JSON.stringify({ error: 'gettting photoshots' }), { status: 500 })
    }
    return NextResponse.json(data);
}