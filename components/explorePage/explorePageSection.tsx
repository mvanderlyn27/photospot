"use client";
import { useEffect, useState } from "react";
import PhotospotMap from "../maps/map";
import ExploreLeftBar from "./exploreLeftBar";
import { Photospot } from "@/types/photospotTypes";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ExploreMap from "./exploreMap";
import {
  useQueryState,
  parseAsFloat,
  parseAsString,
  parseAsArrayOf,
  parseAsInteger,
  useQueryStates,
  parseAsStringLiteral,
} from "nuqs";
import PhotospotPreview from "./photospotPreview";
import { fetcher } from "@/utils/common/fetcher";
import { serializePhotospotSearch } from "@/utils/nuqs/urlSerializer";
import useSWRInfinite from "swr/infinite";
import useSWR from "swr";
import { useBreakpoint } from "@/hooks/tailwind";
const INITIAL_LAT = 40.7128;
const INITIAL_LNG = -74.006;
export default function ExplorePageSection({
  userId,
  initialPhotospots,
}: {
  userId: string;
  initialPhotospots: Photospot[] | null;
}) {
  const [maxDistance, setMaxDistance] = useQueryState(
    "maxDistance",
    parseAsFloat
  );
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(["search", "filter", "saved"]).withDefault("search")
  );
  const [selectedPhotospot, setSelectedPhotospot] = useQueryState(
    "selectedPhotospot",
    parseAsInteger
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(["rating", "nearby", "new", ""]).withDefault("")
  );
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsInteger));
  const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat);
  const [userLocation, setUserLocation] = useQueryStates({
    lat: parseAsFloat.withDefault(40.73),
    lng: parseAsFloat.withDefault(-73.94),
  });

  //setting up data for page
  let data: Photospot[][] | null = null;
  let setSize: any = undefined;
  let photospotsLoading = false;
  let getSWRURL: any = null;

  if (tab === "filter") {
    let args: any = {};
    if (tags) args.tags = tags;
    if (minRating) args.minRating = minRating;
    if (maxDistance) args.maxDistance = maxDistance;
    if (sort) args.sort = sort;
    if (userLocation) {
      console.log(userLocation);
      args = { ...userLocation, ...args };
    }
    if (args) {
      //only look up info if we have args
      getSWRURL = (index: number) => {
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
      };
    }
  }
  if (tab === "saved") {
    getSWRURL = (index: number) => {
      return userId !== null
        ? `/api/photospot/user/${userId}/getSavedPhotospots?pageCount=${
            index + 1
          }${
            userLocation.lat &&
            userLocation.lng &&
            `&lat=${userLocation.lat}&lng=${userLocation.lng}`
          }`
        : null;
    };
  }
  const {
    data: photospotData,
    mutate,
    size,
    setSize: setFilterSize,
    isValidating,
    isLoading,
  } = useSWRInfinite(getSWRURL, fetcher, {
    revalidateFirstPage: false,
    revalidateIfStale: false,
  });
  if (getSWRURL) {
    data = photospotData as Photospot[][] | null;
    setSize = setFilterSize;
    photospotsLoading = isLoading;
  } else {
    //this is when search tab is active
    data = initialPhotospots ? ([initialPhotospots] as Photospot[][]) : null;
    photospotsLoading = false;
  }
  //revisit this part lol
  let selectedPhotospotInfo: Photospot | null = null;
  if (selectedPhotospot) {
    let selectedPhotospotInfoFromLocal = data
      ?.flat()
      .find((photospot) => photospot.id === selectedPhotospot);
    if (selectedPhotospotInfoFromLocal) {
      selectedPhotospotInfo = selectedPhotospotInfoFromLocal;
    }
  }
  const [viewState, setViewState] = useState({
    longitude: selectedPhotospotInfo ? selectedPhotospotInfo.lng : INITIAL_LNG,
    latitude: selectedPhotospotInfo ? selectedPhotospotInfo.lat : INITIAL_LAT,
    zoom: 13,
    bearing: 29,
  });

  //manage state here for search/maps
  /* 
  Potential plan to speed up UI response
    1. Update immediately via useState
    2. Update query params so when page refresh it will show most recent info 
  */
  const { isLg } = useBreakpoint("lg");
  return (
    <>
      <div className={`${isLg ? "flex" : "hidden"} w-full`}>
        <div className="h-full w-[500px]">
          <ExploreLeftBar
            photospots={data}
            photospotsLoading={photospotsLoading}
            selectedPhotospotInfo={selectedPhotospotInfo}
            setSize={setSize}
          />
        </div>
        {tab !== "search" && selectedPhotospotInfo && (
          <div className="absolute left-[525px] top-[25px] bottom-[25px] z-10 overflow-y-auto overflow-x-hidden w-[500px] rounded-xl">
            <PhotospotPreview photospotInfo={selectedPhotospotInfo} />
          </div>
        )}
        <div className="h-full flex-1">
          <ExploreMap
            photospots={data}
            selectedPhotospotInfo={selectedPhotospotInfo}
            initialViewState={viewState}
          />
        </div>
      </div>
      <div
        className={`${
          !isLg ? "flex" : "hidden"
        } flex-col justify-center items-center w-full h-full`}
      >
        <h1 className="text-xl font-semibold">
          Mobile page under construction
        </h1>
      </div>
    </>
  );
}
