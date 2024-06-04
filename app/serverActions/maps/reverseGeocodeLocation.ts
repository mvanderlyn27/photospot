"use server"
import { NewPhotospotInfo } from "@/types/photospotTypes";
import { GeocodingCore, SearchBoxCore, SearchBoxFeatureSuggestion, SearchBoxRetrieveResponse, SearchBoxSuggestion, SessionToken } from "@mapbox/search-js-core";
import { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";

const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
export async function reverseGeocodeLocation(lat: number, lng: number): Promise<NewPhotospotInfo | null> {

    const geocode = new GeocodingCore({ accessToken: mapBoxToken });
    const results = await geocode.reverse({ lat: lat, lng: lng });
    if (results.features.length === 0) return null;
    const feature = results.features[0];

    const newPhotospotInfo = {
        lat: lat,
        lng: lng,
        location_name: feature.properties.name,
        neighborhood: feature.properties.context.neighborhood ? feature.properties.context.neighborhood.name : ""
    }
    return newPhotospotInfo;
}
