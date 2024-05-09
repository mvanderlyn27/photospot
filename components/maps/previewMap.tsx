"use client";
import { animated, useSpring } from "@react-spring/web";
import mapboxgl from "mapbox-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from "react";
import { Map as MapboxMap, Marker } from "react-map-gl";

export default function PreviewMap({ lat, lng, }: { lat: number; lng: number; }) {
    const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
    const [runAnimation, setRunAnimation] = useState(false);
    const [bearing, setBearing] = useState(0);
    const mapRef = useRef<any>(null);
    function rotateCamera(timestamp: number) {
        // clamp the rotation between 0 -360 degrees
        // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
        mapRef.current?.rotateTo((timestamp / 100) % 360, { duration: 0 });
        // Request the next frame of the animation.
        requestAnimationFrame(rotateCamera);
    }
    const handleLoad = (e: mapboxgl.MapboxEvent) => {
        const map = e.target;
        rotateCamera(0);
    }

    return (
        <MapboxMap
            style={{ borderRadius: "10px" }}
            reuseMaps={true}
            longitude={lng}
            latitude={lat}
            zoom={18}
            pitch={60}
            onLoad={handleLoad}
            mapStyle="mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt"
            mapboxAccessToken={mapBoxToken}
            ref={mapRef}
        >
            <Marker longitude={lng} latitude={lat} anchor="bottom">
                <img className="w-10 h-10" src="/selectedPin.svg" />
            </Marker>
        </MapboxMap>
    );
}
