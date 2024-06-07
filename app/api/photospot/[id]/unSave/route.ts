"use server"
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";



export async function POST(request: NextRequest, { params }: { params: { id: number } }) {
    console.log("trying to unsave");
    const supabase = createClient();
    const photospotId = params.id
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
        return new Response('not logged in', { status: 401 });
    }

    const { error } = await supabase.from('saved_photospots').delete().eq('id', user.data.user.id).eq('photospot', photospotId);
    if (error) {
        console.log(error);
        return new Response(error.message, { status: 500 });
    }
    console.log("successfully deleted ", user.data.user.id, ' saved spot ', photospotId);
    return NextResponse.json({ success: true });
}