"use server"
import { SearchBoxCore, SearchBoxFeatureSuggestion, SearchBoxRetrieveResponse, SearchBoxSuggestion, SessionToken } from "@mapbox/search-js-core";
import { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";

const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
export async function suggestLocations(searchQuery: string, user_id: string | undefined, location: LngLat, bbox: LngLatBounds | undefined) {
    const sessionToken = new SessionToken(user_id);
    const search = new SearchBoxCore({ accessToken: mapBoxToken });
    const result = await search.suggest(searchQuery, { sessionToken, limit: 5, proximity: location });
    if (result.suggestions.length === 0) return;
    return result.suggestions;
}
export async function retrieveLocation(suggestion: SearchBoxSuggestion, user_id: string | undefined) {
    const sessionToken = new SessionToken(user_id);
    const search = new SearchBoxCore({ accessToken: mapBoxToken });
    const { features } = await search.retrieve(suggestion, { sessionToken });
    return features[0];
}