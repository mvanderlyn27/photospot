"use client";
import { useRef } from "react";
import { Map as MapboxMap, Marker } from "react-map-gl";

export default function PreviewMap({
  lat,
  lng,
}: {
  lat: number | undefined;
  lng: number | undefined;
}) {
  const mapRef = useRef<any>(null);
  const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    : "";
  return (
    <MapboxMap
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom: 13,
      }}
      // reuseMaps={true}
      mapStyle="mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt"
      mapboxAccessToken={mapBoxToken}
      ref={mapRef}
      cursor="auto"
    >
      {lat && lng && (
        <Marker longitude={lng} latitude={lat} anchor="bottom">
          <img className="w-10 h-10" src="/selectedPin.svg" />
        </Marker>
      )}
    </MapboxMap>
  );
}
