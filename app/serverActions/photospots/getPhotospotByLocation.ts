"use server"
import { Photospot } from "@/types/photospotTypes";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function getPhotospotByLocation(lat: number, lng: number): Promise<Photospot | null> {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("find_photospot_by_lat_lng", { latitude: lat, longitude: lng }).select("*");

    if (error) {
        console.error('Error calling RPC:', error.message);
        redirect('/error?error=' + error.message);
    }
    return data ? data[0] : null;
}