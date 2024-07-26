"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes, Photospot } from "@/types/photospotTypes";
import { serializePhotospotSearch } from "@/utils/nuqs/urlSerializer";

export default function PhotospotSearchResults({
  photospots,
  photospotsLoading,
  setSize,
}: {
  photospots: Photospot[][] | undefined;
  photospotsLoading: boolean;
  setSize: any;
}) {
  console.log("photospots", photospots, setSize);
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
        messageOnLastItem={true}
        emptyMessage="No results found, try a different search"
      />
    </div>
  );
}
