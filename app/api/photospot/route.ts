"use server"

import { createClient } from "@/utils/supabase/server"

export async function GET() {
    const supabase = createClient()
    const { data, error } = await supabase.rpc("get_all_photospots_with_lat_lng").select("*");
    if (error) {
        console.log(error)
        return new Response(error.message, { status: 500 })
    }
    return new Response(JSON.stringify(data), { status: 200 })
}