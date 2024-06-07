"use server"
import { NearbyPhotospot } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function getNearestPhotospots(lat: number, lng: number, numberOfResults: number): Promise<NearbyPhotospot[]> {
    const supabase = createClient();
    const { data: photospots, error: queryErorr } = await supabase.rpc("nearby_photospots", { latt: lat, long: lng, }).select("*").limit(numberOfResults);
    if (queryErorr) {
        redirect("/error?error=" + queryErorr.message);
    }
    return photospots;
}