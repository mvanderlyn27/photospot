"use server"
import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        throw new Error(error.message);
    }
    return new Response(JSON.stringify(data.user));
}