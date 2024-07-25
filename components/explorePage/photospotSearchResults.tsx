"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";
import { serializePhotospotSearch } from "@/utils/nuqs/urlSerializer";

export default function PhotospotSearchResults({
  tags,
  minRating,
  maxDistance,
  sort,
  userLocation,
}: {
  tags?: number[] | null;
  minRating?: number | null;
  maxDistance?: number | null;
  sort?: string | null;
  userLocation?: any;
}) {
  let args: any = {};
  if (tags) args.tags = tags;
  if (minRating) args.minRating = minRating;
  if (maxDistance) args.maxDistance = maxDistance;
  if (sort) args.sort = sort;
  if (userLocation) {
    console.log(userLocation);
    args = { ...userLocation, ...args };
  }
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photospotsLoading,
  } = useSWRInfinite(
    (index) => {
      // setPage(index + 1);
      return `/api/photospot/search${serializePhotospotSearch({
        ...args,
        page: index + 1,
      })}`;
    },
    fetcher,
    {
      revalidateFirstPage: false,
      revalidateIfStale: false,
    }
  );
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
        messageOnLastItem={true}
      />
    </div>
  );
}
