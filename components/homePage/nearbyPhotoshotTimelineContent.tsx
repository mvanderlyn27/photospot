"use client"
import { useEffect, useState } from "react";
import PhotoshotTimelineGrid from "./photoshotTimelineGrid";
//UPDATE TO LOAD FIRST 20-30 photoshots, then pass that down to the photoshotTimelineGrid, along with a path
export default function NearbyPhotoshotTimelineContent() {
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>({ latitude: 40.74, longitude: -73.99 });
    useEffect(() => {
        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;
                setLocation({ latitude, longitude });
            })
        }
    }, []);

    return (
        <>
            {location && <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photospot/nearby?lat=${location ? location.latitude : 40.73}&lng=${location ? location.longitude : -73.94}&`} />}
        </>
    )
}