"use client"
import { useEffect, useState } from "react";
import PhotoshotTimelineGrid from "./photoshotTimelineGrid";
import { Photoshot } from "@/types/photospotTypes";
//UPDATE TO LOAD FIRST 20-30 photoshots, then pass that down to the photoshotTimelineGrid, along with a path
export default function NearbyPhotoshotTimelineContent() {
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>({ latitude: 40.74, longitude: -73.99 });
    const [initialPhotoshots, setInitialPhotoshots] = useState<Photoshot[]>([]);
    useEffect(() => {
        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;
                setLocation({ latitude, longitude });
            })
        }
        // fetch('/api/photospot/nearby?lat=40.73&lng=-73.94').then(res => res.json()).then(data => {
        //     setInitialPhotoshots(data);
        // })
    }, []);

    return (
        <>
            {location && <PhotoshotTimelineGrid initialPhotospots={initialPhotoshots} photoshotPath={`/api/photoshot/timeline/nearby?lat=${location ? location.latitude : 40.73}&lng=${location ? location.longitude : -73.94}&`} />}
        </>
    )
}