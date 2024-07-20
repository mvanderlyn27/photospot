"use server"
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
const searchParams = request.nextUrl.searchParams;
let latRaw = searchParams.get('lat');
let lngRaw = searchParams.get('lng');
let arg : {latt: number | null, lngg: number | null, input_id: number}= {
    latt: null,
    lngg: null,
    input_id : params.id
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

export async function getPhotospotById(arg: {latt: number | null, lngg: number | null, input_id: number}) {
    const supabase = createClient();
    console.log('arg', arg);
    const {data, error} = await supabase.rpc('get_photospot_by_id_lat_lng', arg).select('*').single();
    return {data, error};
}
