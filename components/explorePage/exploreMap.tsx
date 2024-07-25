"use client";
import { GeocodingCore } from "@mapbox/search-js-core";
import { useTheme } from "next-themes";
import { Map as MapboxMap, Marker } from "react-map-gl";
import mapboxgl, { LngLatBounds } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import useSWRInfinite from "swr/infinite";
import { serializePhotospotSearch } from "@/utils/nuqs/urlSerializer";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import {
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  useQueryState,
  useQueryStates,
} from "nuqs";

const MAXBOUNDS = new LngLatBounds([-74.104, 39.98], [-73.82, 40.9]);
export default function ExploreMap({}: {}) {
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
  const [maxDistance, setMaxDistance] = useQueryState(
    "maxDistance",
    parseAsFloat
  );
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault(""));
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsInteger));
  const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat);
  const [selectedPhotospot, setSelectedPhotospot] = useQueryState(
    "selectedPhotospot",
    parseAsInteger
  );
  const [userLocation, setUserLocation] = useQueryStates({
    lat: parseAsFloat.withDefault(40.73),
    lng: parseAsFloat.withDefault(-73.94),
  });

  let args: any = {};
  if (tags) args.tags = tags;
  if (minRating) args.minRating = minRating;
  if (maxDistance) args.maxDistance = maxDistance;
  if (sort) args.sort = sort;
  if (userLocation) {
    console.log(userLocation);
    args = { ...userLocation, ...args };
  }
  const { data: selectedPhotospotInfo } = useSWR(
    `/api/photospot/${selectedPhotospot}`,
    fetcher
  );
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photospotsLoading,
  } = useSWRInfinite(
    (index) => {
      // setPage(index + 1);
      return (tags && tags.length > 0) ||
        minRating !== null ||
        maxDistance !== null ||
        sort !== ""
        ? `/api/photospot/search${serializePhotospotSearch({
            ...args,
            page: index + 1,
          })}`
        : null;
    },
    fetcher,
    {
      initialSize: page,
      revalidateFirstPage: false,
      revalidateIfStale: false,
    }
  );
  console.log("data info", data?.flat());
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
    >
      {selectedPhotospotInfo && (
        <Marker
          longitude={selectedPhotospotInfo.lng}
          latitude={selectedPhotospotInfo.lat}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedPhotospot(null);
          }}
        >
          <img className="w-10 h-10" src="/selectedPin.svg" />
        </Marker>
      )}
      {data &&
        data.flat().map((photospot: any) => (
          <Marker
            key={photospot.id}
            longitude={photospot.lng}
            latitude={photospot.lat}
            anchor="bottom"
            onClick={(e) => {
              setSelectedPhotospot(photospot.id);
            }}
          >
            <img key={photospot.id} className="w-10 h-10" src="/pin.svg" />
          </Marker>
        ))}
    </MapboxMap>
  );
}
