"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";

export default function MyFollowers() {
  const { data: user } = useSWR("/api/profile", fetcher);
  const {
    data,
    mutate,
    size,
    setSize,
    isValidating,
    isLoading: photoshotsLoading,
  } = useSWRInfinite(
    (index) =>
      `/api/profile/user/${user.id}/getFollowers?pageCount=${index + 1}`,
    fetcher
  );
  /*
        Want to create a searchable followers list
    */
  return (
    <InfiniteScrollGrid
      gridData={data ? data : []}
      gridType={GridTypes.follower}
      setSize={setSize}
      size={size}
      dataLoading={photoshotsLoading}
      emptyMessage="No followers yet, get out there! ;)"
      colCount="grid-cols-1"
    />
  );
}
