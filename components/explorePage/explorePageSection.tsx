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
} from "nuqs";
const INITIAL_LAT = 40.7128;
const INITIAL_LNG = -74.006;
export default function ExplorePageSection() {
  const [viewState, setViewState] = useState({
    longitude: INITIAL_LNG,
    latitude: INITIAL_LAT,
    zoom: 13,
    bearing: 29,
  });
  const [maxDistance, setMaxDistance] = useQueryState(
    "maxDistance",
    parseAsFloat
  );
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault(""));
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsInteger));
  const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat);
  const [userLocation, setUserLocation] = useQueryStates({
    lat: parseAsFloat.withDefault(40.73),
    lng: parseAsFloat.withDefault(-73.94),
  });
  //manage state here for search/maps
  /* 
    Plan:
    1. Update immediately via useState
    2. Update query params so when page refresh it will show most recent info 
  */
  return (
    <>
      <div className="h-full w-[500px]">
        <ExploreLeftBar />
      </div>

      <div className="h-full flex-1">
        <ExploreMap />
      </div>
    </>
  );
}
