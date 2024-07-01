"use client";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

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
  console.log("following: ", data);
  /*
        Want to create a searchable following list
        need to figure out how I want to handle followed users/locations 
    */
  return (
    <div>
      <h1>Following</h1>
      {data ? (
        data.flat().map((following) => <h1>{following.username}</h1>)
      ) : (
        <h1>loading</h1>
      )}
    </div>
  );
}
