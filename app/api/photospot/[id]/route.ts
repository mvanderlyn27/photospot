"use server"
import { getPhotospotById } from "@/app/supabaseQueries/photospot";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string} }) {
const searchParams = request.nextUrl.searchParams;
if (!params.id || params.id === 'null' || isNaN(parseInt(params.id))) {
    console.log('no id');
    return new Response('no id', { status: 500 });
}
let latRaw = searchParams.get('lat');
let lngRaw = searchParams.get('lng');
let arg : {latt: number | null, lngg: number | null, input_id: number}= {
    latt: null,
    lngg: null,
    input_id : parseInt(params.id)
};
if(latRaw && lngRaw){
    console.log(latRaw, lngRaw);
    arg.latt = parseFloat(latRaw);
    arg.lngg = parseFloat(lngRaw);
}
    const { data, error } = await getPhotospotById(arg);
    if (error) {
        console.log('error getting photospot', error);
        return new Response(error.message, { status: 500 });
    }
    return NextResponse.json(data);
}


