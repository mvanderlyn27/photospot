"use client"
import { useEffect, useState } from "react";
import PhotospotTimelineGrid from "./photospotTimelineGrid";
import { Photoshot } from "@/types/photospotTypes";
import PhotoshotTimelineGrid from "./photoshotTimelineGrid";
import TextSpinnerLoader from "../common/Loading";
import useSWRInfinite from "swr/infinite";
import { fetcher } from "@/utils/common/fetcher";
import PhotoshotGrid from "../photoshot/photoshotGrid";
//UPDATE TO LOAD FIRST 20-30 photoshots, then pass that down to the photoshotTimelineGrid, along with a path
export default function NearbyPhotoshotTimelineContent() {
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>();
    const [initialPhotoshots, setInitialPhotoshots] = useState<Photoshot[]>([]);
    const {
        data,
        mutate,
        size,
        setSize,
        isValidating,
        isLoading: photoshotsLoading
    } = useSWRInfinite(
        (index) => location ?
            `/api/photoshot/timeline/nearby?lat=${location.latitude}&lng=${location.longitude}&pageCount=${index + 1}` : null,
        fetcher
    );
    useEffect(() => {
        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    const { latitude, longitude } = coords;
                    setLocation({ latitude, longitude });
                },
                () => {
                    console.log('no position set');
                    setLocation({ latitude: 40.73, longitude: -73.94 });
                }
            )
        }
        // fetch('/api/photospot/nearby?lat=40.73&lng=-73.94').then(res => res.json()).then(data => {
        //     setInitialPhotoshots(data);
        // })
    }, []);

    return (
        <>
            <PhotoshotGrid photoshots={data ? data : []} setSize={setSize} size={size} photoshotsLoading={photoshotsLoading} />
        </>
    )
}