"use client"

import { useState } from "react";
import PhotoTimesSelector from "./photoTimeSelector";
import PhotoTimeSelector from "./photoTimeSelector";
import PhotoTimeDisplay from "./photoTimeDisplay";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";
import { Skeleton } from "../ui/skeleton";

export default function PhotoTimeWidget({ lat, lng }: { lat: number, lng: number }) {
    const today = new Date();
    const { data: weather, isLoading: weatherIsLoading, error: weatherError } = useSWR(`/api/weather?lat=${lat}&lng=${lng}`, fetcher);
    const [date, setDate] = useState<Date>(today);
    return <div className="flex flex-col gap-4">
        <PhotoTimeSelector date={date} setDate={setDate} today={today} />
        <PhotoTimeDisplay lat={lat} lng={lng} date={date} weather={weather} columnView={true} />

    </div>;
}