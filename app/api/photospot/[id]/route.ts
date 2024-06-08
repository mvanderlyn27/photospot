"use server"
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request, { params }: { params: { id: number } }) {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_photospot_by_id_lat_lng', { 'input_id': params.id }).select('*').single();
    if (error) {
        return new Response(error.message, { status: 500 });
    }
    return new Response(JSON.stringify(data), { status: 200 });
}