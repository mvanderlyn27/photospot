"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";

export default function SavedSearchResults({
  userId,
}: {
  userId: number | null;
}) {
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photospotsLoading,
  } = useSWRInfinite(
    (index) => {
      return userId !== null
        ? `/api/photospot/user/${userId}/getSavedPhotospots?pageCount=${
            index + 1
          }`
        : null;
    },
    fetcher,
    {
      revalidateFirstPage: true,
      revalidateIfStale: true,
    }
  );
  console.log("search res", data);
  return (
    <div className="w-full">
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
