"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function POST(request: Request) {

    const supabase = createClient();

    const { error } = await supabase.auth.signOut()
    if (error) {
        return new Response(error.message, { status: 400 })
    }

    return new Response("success", { status: 200 })

}