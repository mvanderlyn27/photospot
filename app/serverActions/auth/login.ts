'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signin(email: string, password: string) {
    const supabase = createClient()

    const data = {
        email: email,
        password: password
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.log(error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(username: string, email: string, password: string) {
    const supabase = createClient()
    const data = {
        email: email,
        password: password,
        options: {
            data: {
                username: username
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.log(error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}