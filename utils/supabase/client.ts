import { Database } from '@/types/supabase'
import { createBrowserClient } from '@supabase/ssr'
import { getDBURL } from '../vercel/url'

export function createClient() {
    return createBrowserClient<Database>(
        // process.env.NEXT_PUBLIC_SUPABASE_URL!,
        getDBURL(),
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}