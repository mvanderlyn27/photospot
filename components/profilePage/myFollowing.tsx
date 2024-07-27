"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import InfiniteScrollGrid from "../common/infiniteScrollGrid";
import { GridTypes } from "@/types/photospotTypes";

export default function MyFollowing() {
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
      `/api/profile/user/${user.id}/getFollowing?pageCount=${index + 1}`,
    fetcher
  );
  /*
        Want to create a searchable following list
        need to figure out how I want to handle followed users/locations 
    */
  return (
    <InfiniteScrollGrid
      gridData={data ? data : []}
      gridType={GridTypes.following}
      setSize={setSize}
      size={size}
      dataLoading={photoshotsLoading}
      emptyMessage="Not following anyone yet, make some friends!"
    />
  );
}
