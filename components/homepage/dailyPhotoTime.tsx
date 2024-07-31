"use client"

import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import PhotoTimeDisplay from "../photospot/photoTimeDisplay";

export default function DailyPhotoTime({ lat, lng }: { lat: number, lng: number }) {
    const { data: weather, isLoading: weatherIsLoading, error: weatherError } = useSWR(`/api/weather?lat=${lat}&lng=${lng}`, fetcher);
    return (
        <div className="flex flex-row justify-center item-center gap-4">
            <PhotoTimeDisplay lat={lat} lng={lng} date={new Date()} weather={weather} />
        </div>
    )
}