"use client";
import { fetcher } from "@/utils/common/fetcher";
import { useEffect } from "react";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";
import { useBreakpoint } from "@/hooks/tailwind";

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
  const { isSm } = useBreakpoint("sm");
  return (
    <InfiniteScrollGrid
      gridData={data ? data : []}
      gridType={!isSm ? GridTypes.mobilePhotospot : GridTypes.photospot}
      setSize={setSize}
      size={size}
      dataLoading={photospotsLoading}
      colCount={{
        sm: 3,
      }}
    />
  );
}
