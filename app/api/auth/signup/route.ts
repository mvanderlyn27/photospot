"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function POST(request: Request) {
    const origin = request.headers.get('origin');
    const body = await request.json()

    const { email, password, username } = body
    if (!email || !password || !username) {
        return new Response("Missing email or password or username", { status: 400 })
    }
    const data = {
        email: email,
        password: password,
        options: {
            data: {
                username: username
            },
            emailRedirectTo: `${origin}/api/auth/confirm`
        }
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signUp(data)
    if (error) {
        return new Response(error.message, { status: 400 })
    }

    revalidatePath('/', 'layout')
    redirect('/home')
    // return new Response("success", { status: 200 })

}