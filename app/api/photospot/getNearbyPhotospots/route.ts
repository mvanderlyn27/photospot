"use server"

import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"
//too slow to use in map selection rn
export async function POST(req: NextRequest) {
    const body = await req.json()
    if (!body.lat || !body.lng) {
        console.log('missing lat/lng');
        return new Response("missing lat/lng", { status: 500 })
    }

    const supabase = createClient()
    const { data, error } = await supabase.rpc("nearby_photospots", { latt: body.lat, long: body.lng }).select("*").limit(5);
    if (error) {
        console.log(error)
        return new Response(error.message, { status: 500 })
    }
    console.log("nearby photospots", data);
    return NextResponse.json(data);
}