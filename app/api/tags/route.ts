"use server"

import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase.from('tags').select('*');
    if (error) {
        console.log('error getting tag', error);
        return new Response("error getting tags", { status: 500 });
    }
    return NextResponse.json(data);
}