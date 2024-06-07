"use server"
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return new Response('not logged in', { status: 401 });
    }
    const photospotId = params.id
    const { data, error } = await supabase
        .from('saved_photospots')
        .select('*')
        .eq('id', user.data.user.id)
        .eq('photospot', photospotId);
    if (error) {
        console.log(error);
        return new Response(error.message, { status: 500 });
    }
    console.log('got data: ', data);
    if (data.length > 0) {
        return new Response('true', { status: 200 });
    } else {
        return new Response('false', { status: 200 });
    }
}