"use server"
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import { Database } from "@/types/supabase";
import { randomNumber } from "@/utils/common/math";
// import { createClient } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";
import { SearchBoxFeatureSuggestion } from "@mapbox/search-js-core";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const PHOTO_BUCKET = "photospot_pictures";
export default async function createPhotospot(newPhotospotInfo: NewPhotospotInfo): Promise<Photospot> {
    const supabase = createClient();
    const { data: photospotData, error: photospotError } = await supabase.rpc("create_photospot_with_lat_lng", {
        location_namein: newPhotospotInfo.location_name,
        neighborhoodin: newPhotospotInfo.neighborhood,
        locationin: `POINT(${newPhotospotInfo.lng} ${newPhotospotInfo.lat})`,
    }).select("*").single()
    if (photospotError) {
        console.log("insert error: ", photospotError);
        redirect("error?error=" + photospotError.message);
    }
    console.log('new photospot just created', photospotData)
    return photospotData
}