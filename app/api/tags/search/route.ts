"use server"

import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
    const body = await request.json();
    const supabase = createClient();
    const search = body.name ? body.name : '';
    const { data, error } = await supabase.rpc('search_tags', { input_text: search });
    if (error) {
        console.log('tag error', error);
        return new Response("error getting tags", { status: 500 });
    }
    console.log('res froms search for :', search, ' data:', data);
    return Response.json(data);
}