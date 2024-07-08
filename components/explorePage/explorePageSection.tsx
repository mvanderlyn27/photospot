"use client";
import { useEffect, useState } from "react";
import PhotospotMap from "../maps/map";
import ExploreLeftBar from "./exploreLeftBar";
import { Photospot } from "@/types/photospotTypes";
import { useSearchParams } from "next/navigation";
import ExploreTab from "./exploreTab";
import { motion } from "framer-motion";
export default function ExplorePageSection() {
  // left bar with filters, and
  //get values here
  //pass to children

  const [selectedLocation, setSelectedLocation] = useState<Photospot | null>(
    null
  );
  const [photospotOptions, setPhotospotOptions] = useState<Photospot[]>([]);
  //   const searchParams = useSearchParams();
  //   const tab = searchParams.get("tab") ? searchParams.get("tab") : "";

  return (
    <div className="flex flex-row">
      <ExploreTab
        setSelectedLocation={setSelectedLocation}
        setPhotospotOptions={setPhotospotOptions}
      />
      <div className="h-[800px] w-[800px]">
        {/* <PhotospotMap
          selectedLocation={null}
          setSelectedLocation={undefined}
          viewState={undefined}
          setViewState={undefined}
          handlePhotospotTooClose={undefined}
        /> */}
      </div>
    </div>
  );
}
