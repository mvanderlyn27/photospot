"use client"

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
export const getCurrentUser = () => {
    return supabase.auth.getUser();
} 