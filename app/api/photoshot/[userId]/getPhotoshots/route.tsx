"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
export async function GET({ req, params }: { req: NextRequest, params: { userId: string } }) {
    if (!params.userId) {
        return new Response(JSON.stringify({ error: 'missing user id' }), { status: 400 })
    }

    const supabase = createClient();
    const { data, error } = await supabase.from('photoshots').select('*').eq('created_by', params.userId).order('created_at', { ascending: false });
    if (error) {
        console.log('error', error);
        return new Response(JSON.stringify({ error: 'gettting photoshots' }), { status: 500 })
    }
    return NextResponse.json(data);
}