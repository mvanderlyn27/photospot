"use server"

import { createClient } from "@/utils/supabase/server"
import { getURL } from "@/utils/vercel/url"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const body = await request.json()
    const email = body.email;
    if (!email) {
        return new Response("Missing password", { status: 400 })
    }
    const url = getURL();
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${url}`,
    })
    if (error) {
        return new Response(error.message, { status: 400 })
    }

    revalidatePath('/', 'layout')
    redirect('/')
}