"use client";
import { GeocodingCore } from "@mapbox/search-js-core";
import { useTheme } from "next-themes";
import { Map as MapboxMap } from "react-map-gl";
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
//update to get the photospots from the route url
const MAXBOUNDS = new LngLatBounds([-74.104, 39.98], [-73.82, 40.9]);
export default function ExploreMap() {
  const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    : "";
  const geocode = new GeocodingCore({ accessToken: mapBoxToken });
  mapboxgl.accessToken = mapBoxToken;
  //state
  const { theme } = useTheme();
  const viewState = {
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 13,
    bearing: 29,
  };
  return (
    <MapboxMap
      maxBounds={MAXBOUNDS}
      id="photospotMap"
      initialViewState={{
        ...viewState,
      }}
      reuseMaps={true}
      mapStyle={
        theme && theme === "dark"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt"
      }
      // mapStyle="mapbox://styles/mapbox/standard"
      mapboxAccessToken={mapBoxToken}
      cursor="auto"
    ></MapboxMap>
  );
}
