"use server"
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    if (!body.name) {
        return new Response("missing tag name ", { status: 400 });
    }
    const supabase = createClient();
    const { data, error } = await supabase.from('tags').insert({ name: body.name }).select('*').single();
    if (error) {
        console.log('tag error', error);
        return new Response("error creating tag", { status: 500 });
    }
    console.log('tag created', data);
    return NextResponse.json(data);
}