"use server"

import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const PAGE_SIZE = 20;
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    let searchParams = req.nextUrl.searchParams;
    if (!params.userId) {
        return new Response(JSON.stringify({ error: 'missing user id' }), { status: 400 })
    }
    let pageCountRaw = searchParams.get('pageCount');
    let pageCount = 1;
    if (pageCountRaw) {
        pageCount = parseInt(pageCountRaw);
    }
    const supabase = createClient();
    const { data, error } = await supabase.from('photoshots').select('*').eq('created_by', params.userId).order('created_at', { ascending: false }).range((PAGE_SIZE * (pageCount - 1)), (PAGE_SIZE * pageCount) - 1);
    if (error) {
        console.log('error', error);
        return new Response(JSON.stringify({ error: 'gettting photoshots' }), { status: 500 })
    }
    return NextResponse.json(data);
}