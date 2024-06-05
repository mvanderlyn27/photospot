"use client";
import { cn } from "@/lib/utils";
import { animated, useSpring } from "@react-spring/web";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from "react";
import { Map as MapboxMap, Marker } from "react-map-gl";
import { Button, buttonVariants } from "../ui/button";
import { FaDirections } from "react-icons/fa";
import { Card } from "../ui/card";
import { Photospot } from "@/types/photospotTypes";
import { Skeleton } from "../ui/skeleton";

export default function PreviewMap({ lat, lng, photospot }: { lat: number; lng: number; photospot: Photospot }) {
    const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
    // const [runAnimation, setRunAnimation] = useState(true);
    const [bearing, setBearing] = useState(0);
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapRef = useRef<any>(null);
    // function rotateCamera(timestamp: number) {
    //     // clamp the rotation between 0 -360 degrees
    //     // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    //     mapRef.current?.rotateTo((timestamp / 100) % 360, { duration: 0 });
    //     // Request the next frame of the animation.
    //     requestAnimationFrame(rotateCamera);
    // }
    // const handleLoad = (e: mapboxgl.MapboxEvent) => {
    //     const map = e.target;
    //     rotateCamera(0);
    // }
    // useEffect(() => {
    //     return () => {
    //         if (runAnimation == true) {
    //             rotateCamera(0)
    //         }

    //     };
    // }, [runAnimation]);
    const initialMapState = {
        zoom: 16,
        latitude: lat,
        longitude: lng,
        bearing: 29,
        pitch: 0
    }
    const handleDirections = () => {
        if (photospot) {
            window.open(`https://www.google.com/maps?q=${photospot.lat},${photospot.lng}`);
        }
    }
    const handleReset = () => {
        if (mapRef.current) {
            mapRef.current.flyTo({ pitch: initialMapState.pitch, bearing: initialMapState.bearing, zoom: initialMapState.zoom, center: [photospot.lng, photospot.lat], })
        }
    }
    const handleMapLoad = (e: mapboxgl.MapboxEvent) => {
        console.log('handleMapLoad', e);
        setMapLoaded(true);
    }

    return (

        <Card className="w-full h-full flex flex-col relative">
            <div className={`flex-0 p-4 flex flex-row justify-between items-center ${mapLoaded ? "" : "invisible"}`}>
                <h1 className="text-xl ">{photospot.address}</h1>
                <div className="flex flex-row gap-4">
                    <Button onClick={handleReset}>Reset</Button>
                    <div className={"cursor-pointer " + cn(buttonVariants({ variant: 'default' }))} onClick={() => handleDirections()}>
                        Directions <FaDirections className="ml-2 w-6 h-6" />
                    </div>
                </div>
            </div>
            <div className={`w-full flex-1 ${mapLoaded ? "" : "invisible"}`} >
                <MapboxMap
                    reuseMaps={true}
                    // longitude={lng}
                    // latitude={lat}
                    initialViewState={initialMapState}
                    dragRotate={true}
                    // zoom={18}
                    // pitch={60}
                    // onLoad={handleLoad}
                    mapStyle="mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt"
                    mapboxAccessToken={mapBoxToken}
                    onLoad={(e) => { handleMapLoad(e) }}
                    ref={mapRef}
                >
                    <Marker longitude={lng} latitude={lat} anchor="bottom">
                        <img className="w-10 h-10" src="/selectedPin.svg" />
                    </Marker>
                </MapboxMap>
            </div>

            <Skeleton className={`bg-slate-800/10 absolute top-0 bottom-0 right-0 left-0 ${!mapLoaded ? "" : "invisible"}`} />

        </Card>
    );
}
