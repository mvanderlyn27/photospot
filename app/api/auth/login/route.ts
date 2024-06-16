"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function POST(request: Request) {

    const body = await request.json()

    const { email, password } = body
    if (!email || !password) {
        return new Response("Missing email or password", { status: 400 })
    }
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })
    if (error) {
        return new Response(error.message, { status: 400 })
    }

    //to update the navbar
    revalidatePath('/', 'layout')
    // revalidatePath('/home', 'layout')
    // redirect('/home')
    return new Response("success", { status: 200 })

}