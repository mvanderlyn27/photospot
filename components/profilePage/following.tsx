"use client"
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

export default function Following() {
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
            `/api/photoshot/user/${user.id}/getPhotoshots?pageCount=${index + 1}`,
        fetcher
    );
    return (
        <div>
            <h1>users</h1>
        </div>
    )
}