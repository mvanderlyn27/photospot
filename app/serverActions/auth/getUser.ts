"use server"

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation";

export async function getUser() {

    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error) {
        redirect('/error?error=' + error.message);
    }
    return data.user;
}