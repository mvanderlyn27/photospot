"use client"
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

export default function Followers() {
    const { data: user } = useSWR("/api/profile", fetcher);
    const {
        data,
        mutate,
        size,
        setSize,
        isValidating,
        isLoading: photoshotsLoading
    } = useSWRInfinite(
        (index) =>
            `/api/profile/user/${user.id}/getFollowers?pageCount=${index + 1}`,
        fetcher
    );
    console.log('followers: ', data);
    /*
        Want to create a searchable followers list
    */
    return (
        <div>
            <h1>Followers</h1>
            {
                data ? data.flat().map((follower) =>
                    <h1>{follower.username}</h1>
                ) :
                    <h1>loading</h1>
            }
        </div>
    )
}