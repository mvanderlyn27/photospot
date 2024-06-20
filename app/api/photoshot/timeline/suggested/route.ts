"use server"
/*
    Alg is very basic for reommendations: 
        - gets all photoshots that have a tag in commone with a photoshot a user liked
        - gets all photoshots from photospots a user has saved
        - sorts descending
*/
import { createClient } from "@/utils/supabase/server"
import { useSearchParams } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams 
    console.log('searchParams', searchParams);

    
    const supabase = createClient()
    const user = await supabase.auth.getUser();
    if (!user?.data.user) {
        console.log("missing user info");
        return new Response(JSON.stringify({ error: 'missing user info' }), { status: 400 })
    }
    const { data: photoshots, error: photoshotError } = await supabase.rpc('recommend_photoshots', { user_id: user.data.user.id, limit_count : 20 });
    if (photoshotError) {
        return new Response(JSON.stringify(photoshotError), { status: 500 })
    }
    console.log('photoshots', photoshots);
    return new Response(JSON.stringify(photoshots), { status: 200 })
}