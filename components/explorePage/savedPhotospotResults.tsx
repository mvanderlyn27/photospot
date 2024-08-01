"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes, Photospot } from "@/types/photospotTypes";
import { getCols } from "@/utils/responsive/grids";

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
        colCount={getCols()}
        dataLoading={photospotsLoading}
        emptyMessage="No saved photospots"
      />
    </div>
  );
}
