"use client";
import { fetcher } from "@/utils/common/fetcher";
import { useSearchParams } from "next/navigation";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";

export default function PhotospotSearchResults() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const url = "/api/photospot/search";
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photospotsLoading,
  } = useSWRInfinite(
    (index) => `${url}?pageCount=${index + 1}&${params.toString()}`,
    fetcher
  );
  console.log("search res", data);
  return (
    <div className="">
      <InfiniteScrollGrid
        gridData={data}
        gridType={GridTypes.photospotSearch}
        setSize={setSize}
        size={size}
        colCount={{
          sm: 1,
          md: 1,
          lg: 1,
          xl: 1,
        }}
        dataLoading={photospotsLoading}
      />
    </div>
  );
}
