"use client"
import { useEffect, useState } from "react";
import PhotospotTimelineGrid from "./photospotTimelineGrid";
import { Photoshot } from "@/types/photospotTypes";
import PhotoshotTimelineGrid from "./photoshotTimelineGrid";
import TextSpinnerLoader from "../common/Loading";
//UPDATE TO LOAD FIRST 20-30 photoshots, then pass that down to the photoshotTimelineGrid, along with a path
export default function NearbyPhotoshotTimelineContent() {
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>();
    const [initialPhotoshots, setInitialPhotoshots] = useState<Photoshot[]>([]);
    useEffect(() => {
        if ('geolocation' in navigator) {
            // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;
                setLocation({ latitude, longitude });
            })
        }
        else {
            setLocation({ latitude: 40.73, longitude: -73.94 });
        }
        // fetch('/api/photospot/nearby?lat=40.73&lng=-73.94').then(res => res.json()).then(data => {
        //     setInitialPhotoshots(data);
        // })
    }, []);

    return (
        <>
            {location && <PhotospotTimelineGrid photospotPath={`/api/photospot/getNearbyPhotospots?lat=${location ? location.latitude : 40.73}&lng=${location ? location.longitude : -73.94}&`} />}
            {!location && <div className="absolute inset-0 h-screen flex items-center justify-center"><TextSpinnerLoader text="Loading nearby photoshots" /></div>}
            {/* {location && <PhotoshotTimelineGrid photoshotPath={`/api/photoshot/timeline/nearby?lat=${location ? location.latitude : 40.73}&lng=${location ? location.longitude : -73.94}&`} initialPhotospots={[]} />} */}
        </>
    )
}