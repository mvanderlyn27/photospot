"use client";
import { useEffect, useState } from "react";
import PhotospotMap from "../maps/map";
import ExploreLeftBar from "./exploreLeftBar";
import { Photospot } from "@/types/photospotTypes";
import { useSearchParams } from "next/navigation";
import { filterOptions } from "./exploreSearchForm";
import ExploreTab from "./exploreTab";
import { motion } from "framer-motion";
const INITIAL_LAT = 40.7128;
const INITIAL_LNG = -74.006;
export default function ExplorePageSection({
  searchParams,
  initialPhotospots,
  initialSelectedPhotospot,
}: {
  searchParams?: {
    photospotNameQuery?: string;
    searchMode?: string;
    tags?: string[];
    selectedPhotospotId?: string;
    tab?: string;
  };
  initialPhotospots: Photospot[];
  initialSelectedPhotospot?: Photospot;
}) {
  const [photospots, setPhotospots] = useState<Photospot[]>([]);
  const [selectedPhotospot, setSelectedPhotospot] = useState<
    Photospot | undefined
  >(initialSelectedPhotospot);
  const [viewState, setViewState] = useState({
    longitude: INITIAL_LNG,
    latitude: INITIAL_LAT,
    zoom: 13,
    bearing: 29,
  });
  console.log("searchParams", searchParams);
  const massageTagData = (tags: string[]) => {
    if (!Array.isArray(tags)) {
      let num = parseInt(tags);
      if (num === undefined) return [];
      return [num];
    }
    if (Array.isArray(tags) && tags.length === 0) return [];

    return tags.map((tag) => parseInt(tag));
  };
  return (
    <div className="w-full flex flex-row overflow-hidden min-h-0">
      <ExploreTab
        photospotNameQuery={searchParams?.photospotNameQuery ?? ""}
        searchMode={
          searchParams?.searchMode !== undefined &&
          filterOptions.some((el) => el === searchParams?.searchMode)
            ? searchParams.searchMode
            : ""
        }
        tags={massageTagData(searchParams?.tags ?? [])}
        tab={searchParams?.tab ?? "search"}
        selectedPhotospot={selectedPhotospot}
        setSelectedPhotospot={setSelectedPhotospot}
        photospots={photospots}
        setPhotospots={setPhotospots}
      />
      <div className="h-full w-full">
        <PhotospotMap
          selectedLocation={selectedPhotospot ? selectedPhotospot : null}
          setSelectedLocation={setSelectedPhotospot}
          viewState={viewState}
          setViewState={setViewState}
        />
      </div>
    </div>
  );
}
