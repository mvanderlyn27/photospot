"us server"
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: { id: number } }) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("photoshot_tags")
        .select("*, ...tags(name)")
        .eq("id", params.id)
    if (error) {
        console.log("tag error", error);
        return new Response(error.message, { status: 500 });
    }
    return NextResponse.json(data);
}