"use client";
import { SearchBox } from "@mapbox/search-js-react";
import mapboxgl, { MarkerOptions } from "mapbox-gl";
import { useEffect, useState } from "react";
export default function AutoComplete({
  mapRef,
  selectedLocation,
  setSelectedLocation,
}: {
  mapRef: any;
  selectedLocation: any;
  setSelectedLocation: any;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  //add mapbox map ref, and marker settings
  //
  useEffect(() => {
    console.log("mapref", mapRef, mapRef.current);
    if (token) {
      mapboxgl.accessToken = token;
    }
  }, [mapRef]);
  let markerObj = document.createElement("img");
  markerObj.src = "/pin.svg";
  markerObj.style.width = "20px";
  markerObj.style.height = "20px";
  const marker: MarkerOptions = {
    element: markerObj,
    anchor: "bottom",
  };
  return (
    <div>
      {/* @ts-expect-error Server Component */}
      {token && (
        <SearchBox
          accessToken={token}
          options={{
            language: "en",
            country: "US",
          }}
          theme={{
            variables: {
              fontFamily: "Avenir, sans-serif",
              unit: "20px",
              padding: "0.5em",
              borderRadius: "10px",
              boxShadow: "0 0 0 1px silver",
              colorBackground: "#f7f4e9",
            },
          }}
          map={mapRef}
          marker={true}
          //   mapboxgl={mapboxgl}
          placeholder="Search a location"
          value=""
        />
      )}
    </div>
  );
}
