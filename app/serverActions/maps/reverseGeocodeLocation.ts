"use server"
import { NewPhotospotInfo } from "@/types/photospotTypes";
import { GeocodingCore, SearchBoxCore, SearchBoxFeatureSuggestion, SearchBoxRetrieveResponse, SearchBoxSuggestion, SessionToken } from "@mapbox/search-js-core";
import { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";

const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
export async function reverseGeocodeLocation(lat: number, lng: number): Promise<NewPhotospotInfo | null> {

    const geocode = new GeocodingCore({ accessToken: mapBoxToken });
    //maybe look more into making better , want to get POI eventually, can only do street names
    const results = await geocode.reverse({ lat: lat, lng: lng }, { country: "us", limit: 1, language: "en" });
    if (results.features.length === 0) return null;
    const feature = results.features[0];

    const newPhotospotInfo = {
        lat: lat,
        lng: lng,
        address: feature.properties.full_address,
        location_name: feature.properties.name_preferred ? feature.properties.name_preferred : feature.properties.name,
        neighborhood: feature.properties.context.neighborhood ? feature.properties.context.neighborhood.name : ""
    }
    return newPhotospotInfo;
}
