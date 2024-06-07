"use client"

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();
export const getPhotoshotsByPhotospots = (photospotId: number) => {
    return supabase.from("photoshots").select("*").eq("photospot_id", photospotId);
}
