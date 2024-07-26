"use client"
import { createClient } from "@/utils/supabase/client";
import { User, UserIdentity } from "@supabase/supabase-js";
//should put all  query logic in here 
const supabase = createClient();
export const getPhotospots = () => {
    return supabase.rpc("get_all_photospots_with_lat_lng").select("*");
}
export const getPhotospotStatsById = (id: number) => {
    return supabase.from('photospot_rating_stats').select('*').eq('id', id).single();
}
export const getPhotospotByLocation = (lat: number, lng: number) => {
    return supabase.rpc("find_photospot_by_lat_lng", { latitude: lat, longitude: lng }).select("*");
}

export const getNearbyPhotospots = (lat: number, lng: number, limit: number) => {
    // supabase.rpc("nearby_photospots", { latt: lat, long: lng, }).select("*").limit(limit);
}
export const getSavedPhotospots = (user: User) => {
    return supabase.from('saved_photospots').select('*').eq('id', user.id);
}
export const getUserSavedPhotospots = (user: User, id: number) => {
    return supabase.from('saved_photospots').select('*').eq('id', user.id).eq('photospot', id);
}
/*
    convert get photospot tags needs to be turned to rpc function, 
    or converted into one longer query
    
*/
export const getPhotospotById = async (arg: {latt: number | null, lngg: number | null, input_id: number}) => {
    const {data, error} = await supabase.rpc('get_photospot_by_id_lat_lng', arg).select('*').single();
    return {data, error};
}