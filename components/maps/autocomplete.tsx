"use client";
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import { fetcher } from "@/utils/common/fetcher";
import { SearchBoxRetrieveResponse } from "@mapbox/search-js-core";
import dynamic from "next/dynamic";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const SearchBox = dynamic(
  () =>
    import("@mapbox/search-js-react").then(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      /* eslint-disable @typescript-eslint/no-unsafe-return */
      (module) => module.SearchBox as any
    ),
  { ssr: false }
  /* eslint-disable @typescript-eslint/no-explicit-any */
) as any;
import useSWR from "swr";
export default function AutoComplete({
  selectedLocation,
  setSelectedLocation,
}: {
  selectedLocation: any;
  setSelectedLocation: any;
}) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  //can update to look only within the bounds of the map later
  const { data: photospots, isLoading: isLoadingPhotospots } = useSWR("/api/photospot", fetcher);

  //add mapbox map ref, and marker settings
  //
  const handleRetrieve = (e: SearchBoxRetrieveResponse) => {
    let existingPhotospot = null;
    photospots.forEach((photospot: Photospot) => {
      if (
        photospot.lat === e.features[0].geometry.coordinates[1] &&
        photospot.lng === e.features[0].geometry.coordinates[0]
      ) {
        existingPhotospot = photospot;
      }
    });
    if (existingPhotospot) {
      setSelectedLocation(existingPhotospot);
    } else {
      const newPhotospotInfo = {
        location_name: e.features[0].properties.name_preferred
          ? e.features[0].properties.name_preferred
          : e.features[0].properties.name,
        address: e.features[0].properties.full_address,
        neighborhood: e.features[0].properties.context.neighborhood?.name,
        lat: e.features[0].geometry.coordinates[1],
        lng: e.features[0].geometry.coordinates[0],
      } as NewPhotospotInfo;
      setSelectedLocation(newPhotospotInfo);
    }
  };
  //can use the interceptSearch prop to look up if a photospot name already exists before searching for new location
  //can improve search with proximity too
  return (
    <div className="w-full">
      {token && (
        <SearchBox
          accessToken={token}
          options={{
            language: "en",
            country: "US",
            limit: 5,
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
          placeholder="Search a location"
          onRetrieve={handleRetrieve}
          value={selectedLocation ? selectedLocation.location_name : ""}
        />
      )}
    </div>
  );
}
