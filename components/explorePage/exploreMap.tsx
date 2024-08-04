"use client";
import { GeocodingCore } from "@mapbox/search-js-core";
import { useTheme } from "next-themes";
import { AttributionControl, Map as MapboxMap, Marker, useMap } from "react-map-gl";
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useSWRInfinite from "swr/infinite";
import { serializePhotospotSearch } from "@/utils/nuqs/urlSerializer";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import { parseAsArrayOf, parseAsFloat, parseAsInteger, parseAsString, useQueryState, useQueryStates } from "nuqs";
import { Photospot } from "@/types/photospotTypes";
import { useEffect } from "react";
import PhotospotMap from "../maps/map";

const MAXBOUNDS = new LngLatBounds([-74.104, 39.98], [-73.82, 40.9]);
export default function ExploreMap({
  photospots,
  selectedPhotospotInfo,
  initialViewState,
  setActiveSnapPoint,
  setAccordionOpen,
}: {
  photospots: Photospot[][] | null;
  selectedPhotospotInfo: Photospot | null;
  initialViewState: any;
  setActiveSnapPoint?: any;
  setAccordionOpen?: any;
}) {
  const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
  const geocode = new GeocodingCore({ accessToken: mapBoxToken });
  mapboxgl.accessToken = mapBoxToken;
  //state
  const { theme } = useTheme();

  const { exploreMap } = useMap();
  const [selectedPhotospotId, setSelectedPhotospotId] = useQueryState("selectedPhotospot", parseAsInteger);
  // useEffect(() => {
  //   if (selectedPhotospotId !== null && selectedPhotospotInfo && exploreMap) {
  //     //set map to be centered on it
  //     exploreMap.flyTo({
  //       center: [selectedPhotospotInfo.lng, selectedPhotospotInfo.lat],
  //     });
  //   }
  // }, [selectedPhotospotInfo, selectedPhotospotId]);
  return (
    <MapboxMap
      attributionControl={false}
      maxBounds={MAXBOUNDS}
      id="photospotMap"
      initialViewState={initialViewState}
      reuseMaps={true}
      mapStyle={
        theme && theme === "dark"
          ? "mapbox://styles/mapbox/dark-v11"
          : "mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt"
      }
      // mapStyle="mapbox://styles/mapbox/standard"
      mapboxAccessToken={mapBoxToken}
      cursor="auto"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        if (setActiveSnapPoint) setActiveSnapPoint(0.6);
        setSelectedPhotospotId(null);
      }}>
      {photospots &&
        photospots.flat().map((photospot: any) => (
          <Marker
            key={photospot.id}
            longitude={photospot.lng}
            latitude={photospot.lat}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              if (photospot.id === selectedPhotospotId) {
                // e.originalEvent.stopPropagation();
                if (setActiveSnapPoint) setActiveSnapPoint(0.6);
                if (setAccordionOpen) setAccordionOpen(false);
                setSelectedPhotospotId(null);
              } else {
                // if (setActiveSnapPoint) setActiveSnapPoint(1);
                setSelectedPhotospotId(photospot.id);
              }
            }}>
            <img
              key={photospot.id}
              className="w-10 h-10 z-1"
              src={photospot.id === selectedPhotospotId ? "/selectedPin.svg" : "/pin.svg"}
            />
          </Marker>
        ))}
    </MapboxMap>
  );
}
