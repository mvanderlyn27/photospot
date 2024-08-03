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
import ExploreBottomBar from "./exploreBottomBar";
import ExploreTopBar from "./exploreTopBar";
import { Drawer, DrawerContent } from "../ui/drawer";
import { Separator } from "../ui/separator";
import PhotospotSearchResults from "./photospotSearchResults";
import { Button } from "../ui/button";
import { MdClose } from "react-icons/md";
const INITIAL_LAT = 40.7128;
const INITIAL_LNG = -74.006;
export default function ExplorePageSection({
  userId,
  initialPhotospots,
}: {
  userId: string;
  initialPhotospots: Photospot[] | null;
}) {
  const [maxDistance, setMaxDistance] = useQueryState("maxDistance", parseAsFloat);
  const [tab, setTab] = useQueryState("tab", parseAsStringLiteral(["search", "filter", "saved"]).withDefault("search"));
  const [selectedPhotospot, setSelectedPhotospot] = useQueryState("selectedPhotospot", parseAsInteger);
  const [sort, setSort] = useQueryState("sort", parseAsStringLiteral(["rating", "nearby", "new", ""]).withDefault(""));
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsInteger));
  const [minRating, setMinRating] = useQueryState("minRating", parseAsFloat);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [activeSnapPoint, setActiveSnapPoint] = useState(0.6);
  const [oldScrollY, setOldScrollY] = useState(window.scrollY || document.documentElement.scrollTop);
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
        return (tags && tags.length > 0) || minRating !== null || maxDistance !== null || sort !== ""
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
        ? `/api/photospot/user/${userId}/getSavedPhotospots?pageCount=${index + 1}${
            userLocation.lat && userLocation.lng && `&lat=${userLocation.lat}&lng=${userLocation.lng}`
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
  useEffect(() => {
    if (photospotData) {
      setActiveSnapPoint(0.6);
      setDrawerOpen(true);
      setAccordionOpen(false);
    }
  }, [photospotData]);
  useEffect(() => {
    if (accordionOpen) {
      setDrawerOpen(false);
    }
  }, [accordionOpen]);
  useEffect(() => {
    if (drawerOpen) {
      setActiveSnapPoint(0.6);
      setAccordionOpen(false);
    }
  }, [drawerOpen]);
  useEffect(() => {
    if (selectedPhotospot) {
      setDrawerOpen(true);
      setAccordionOpen(false);
    }
  }, [selectedPhotospot]);
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
    let selectedPhotospotInfoFromLocal = data?.flat().find((photospot) => photospot.id === selectedPhotospot);
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
  const { isXl } = useBreakpoint("xl");
  const handleScroll = (e: any) => {
    console.log("scroll event", e);
    if (e.target.scrollTop > oldScrollY) {
      setActiveSnapPoint(1);
    } else if (e.target.scrollTop === oldScrollY) {
      setActiveSnapPoint(0.6);
    }
    setOldScrollY(e.target.scrollTop);
  };
  return (
    <>
      <div className={`${isLg || isXl ? "flex" : "hidden"} w-full`}>
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
          <ExploreMap photospots={data} selectedPhotospotInfo={selectedPhotospotInfo} initialViewState={viewState} />
        </div>
      </div>
      <div
        className={`${!isLg && !isXl ? "flex" : "hidden"}  w-full h-full relative`}
        onClick={() => {
          setActiveSnapPoint(0.6);
        }}>
        <ExploreMap photospots={data} selectedPhotospotInfo={selectedPhotospotInfo} initialViewState={viewState} />

        <div
          className="absolute top-4 left-4 right-4"
          onClick={() => {
            setActiveSnapPoint(0.6);
          }}>
          <ExploreTopBar
            photospots={data}
            selectedPhotospotInfo={selectedPhotospotInfo}
            photospotsLoading={photospotsLoading}
            accordionOpen={accordionOpen}
            setAccordionOpen={setAccordionOpen}
          />
        </div>
        {photospotData && (
          <div className="absolute bottom-10 left-4 right-4 z-100">
            <ExploreBottomBar setDrawerOpen={setDrawerOpen} />
          </div>
        )}
        <Drawer
          open={drawerOpen}
          modal={false}
          // handleOnly={true}
          onClose={() => setDrawerOpen(false)}
          snapPoints={[0.6, 1]}
          activeSnapPoint={activeSnapPoint}
          // setActiveSnapPoint={() => (data ? 0 : 1)}
        >
          {photospotData && !selectedPhotospot && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveSnapPoint(1);
              }}>
              <DrawerContent className="pt-4 cursor-pointer">
                {/* <div className="absolute top-0 left-0 right-0"> */}
                {/* <Separator /> */}
                {/* <ExploreBottomBar /> */}
                <div className="h-[60vh] overflow-auto p-4" onScroll={handleScroll}>
                  <PhotospotSearchResults
                    photospots={data ? data : undefined}
                    setSize={setSize}
                    photospotsLoading={photospotsLoading}
                  />
                </div>
                {/* </div> */}
              </DrawerContent>
            </div>
          )}
          {selectedPhotospot && selectedPhotospotInfo && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setActiveSnapPoint(1);
              }}>
              <DrawerContent className="h-auto p-4">
                <div className="absolute top-2 right-2">
                  <Button variant="ghost" onClick={() => setSelectedPhotospot(null)}>
                    <MdClose className="w-6 h-6 z-top " />
                  </Button>
                </div>
                <div className="h-[60vh] overflow-auto p-2" onScroll={handleScroll}>
                  <PhotospotPreview photospotInfo={selectedPhotospotInfo} />
                </div>
              </DrawerContent>
            </div>
          )}
        </Drawer>
        {/* </div> */}
      </div>
    </>
  );
}
