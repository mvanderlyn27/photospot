"use server"
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
    //update to have an optional limit for responses
    const supabase = createClient()
    const id = params.id;
    let query = await supabase.rpc('get_tags_for_photospot', { 'photospotid': id }).select('*');
    const { data, error } = await query;
    if (error) {
        console.log(error);
        return new Response(error.message, { status: 500 });
    }
    console.log('data from tag req', data);
    return NextResponse.json(data);
}
