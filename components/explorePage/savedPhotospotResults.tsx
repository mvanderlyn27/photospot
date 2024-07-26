"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes, Photospot } from "@/types/photospotTypes";

export default function SavedSearchResults({
  photospots,
  photospotsLoading,
  setSize,
}: {
  photospots?: Photospot[][];
  photospotsLoading: boolean;
  setSize: any;
}) {
  return (
    <div className="w-full">
      <InfiniteScrollGrid
        gridData={photospots}
        gridType={GridTypes.photospotSearch}
        setSize={setSize}
        size={photospots ? photospots.length : 0}
        colCount={{
          sm: 1,
          md: 1,
          lg: 1,
          xl: 1,
        }}
        dataLoading={photospotsLoading}
        emptyMessage="No saved photospots"
      />
    </div>
  );
}
