"use client";
import { fetcher } from "@/utils/common/fetcher";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import useSWR from "swr";
import { GridTypes } from "@/types/photospotTypes";
import { useBreakpoint } from "@/hooks/tailwind";
import { getCols } from "@/utils/responsive/grids";

export default function MySavedPhotospots() {
  const { data: profileInfo } = useSWR("/api/profile", fetcher);
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photospotsLoading,
  } = useSWRInfinite(
    (index) =>
      `/api/photospot/user/${profileInfo.id}/getSavedPhotospots?pageCount=${
        index + 1
      }`,
    fetcher
  );
  useEffect(() => {
    console.log("data: ", data);
    //get top photoshots for all photospots
  }, [data]);

  const { isSm } = useBreakpoint("sm");
  return (
    <InfiniteScrollGrid
      gridData={data ? data : []}
      gridType={!isSm ? GridTypes.mobilePhotospot : GridTypes.photospot}
      setSize={setSize}
      size={size}
      dataLoading={photospotsLoading}
      lastItemMessage={"No more photoshots"}
      colCount={getCols({ sm: 3 })}
    />
  );
}
