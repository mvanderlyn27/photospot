"use server"
import { createClient } from "@/utils/supabase/server"

export async function GET() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('photoshots').select('*').order('created_at', { ascending: false })
    if (error) {
        return new Response(JSON.stringify(error), { status: 500 })
    }
    return new Response(JSON.stringify(data), { status: 200 })
}
