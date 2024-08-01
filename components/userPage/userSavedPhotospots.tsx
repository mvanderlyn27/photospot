"use client";
import { fetcher } from "@/utils/common/fetcher";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";
import { useBreakpoint } from "@/hooks/tailwind";
import { getCols } from "@/utils/responsive/grids";

export default function UserSavedPhotospots({ userId }: { userId: string }) {
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photospotsLoading,
  } = useSWRInfinite(
    (index) =>
      `/api/photospot/user/${userId}/getSavedPhotospots?pageCount=${index + 1}`,
    fetcher
  );
  useEffect(() => {
    console.log("data: ", data);
    //get top photoshots for all photospots
  }, [data]);
  const { isXl } = useBreakpoint("xl");
  return (
    <InfiniteScrollGrid
      gridData={data ? data : []}
      gridType={GridTypes.squarePhotospot}
      setSize={setSize}
      size={size}
      dataLoading={photospotsLoading}
      colCount={getCols({ sm: 3, md: 3, lg: 4, xl: 4 })}
      showDetails={isXl}
    />
  );
}
