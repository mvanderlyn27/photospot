"use server"

import { NewPhotospotInfo, Photoshot } from "@/types/photospotTypes";
import { isPhotospot } from "@/utils/common/typeGuard";
import { createClient } from "@/utils/supabase/server";
export async function PUT(request: Request) {
    const data = await request.json();
    if (!data) {
        return new Response("Missing data", { status: 400 });
    }
    const supabase = createClient();
    const { data: photospot, error } = await supabase
        .from("photospots")
        .insert([data])
        .select("*")
        .single();
    if (error) {
        console.log("insert error: ", error);
        return new Response("error creating photospot", { status: 500 });
    }
    return new Response(JSON.stringify(photospot), { status: 200 });
}