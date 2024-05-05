"use client"
import { Map as MapboxMap, GeolocateControl, NavigationControl, Marker, useMap, MarkerEvent } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from "react";
import { round } from "@/utils/common/math";
import { Photospot } from "@/types/photospotTypes";
// import { Pin } from '@/media/pin.tsx';
const INITIAL_LAT: number = 40.72377;
const INITIAL_LNG: number = -73.99837;
//decides how accurate points should be, I want to not round at all to not lose data in where user places photospot
// just need to see how much info db can take
const LAT_LNG_DIGITS = null;

export default function PhotospotMap({ location, setLocation, photospots, setViewingPhotospot }: { location: { lat: number, lng: number } | null, setLocation: any, photospots: Photospot[], setViewingPhotospot: any }) {
    const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
    //setup to take options for widht/height
    //allow set location to work for clicking on a location
    const mapRef = useRef<any>(null);
    useEffect(() => {
        console.log('photospots', photospots);
    })
    const handleClick = (e: any) => {
        console.log('setLocation', e);
        const lat = round(e.lngLat.lat, LAT_LNG_DIGITS);
        const lng = round(e.lngLat.lng, LAT_LNG_DIGITS);
        mapRef.current.flyTo({ center: [lng, lat], })
        setLocation({ lat: lat, lng: lng });
    }

    const handleMapLoad = (e: any) => {
        const map = e.target;
        console.log('map_styles', map.style);
        console.log('photospot', photospots[0].location);
        //maybe 
    }
    const handleMarkerClick = (e: any, photospot: Photospot) => {
        e.originalEvent.stopPropagation();
        setViewingPhotospot(photospot);
    }
    return (
        <MapboxMap
            initialViewState={{
                longitude: location ? location.lng : INITIAL_LNG,
                latitude: location ? location.lat : INITIAL_LAT,
                zoom: 13
            }}
            reuseMaps={true}
            mapStyle="mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt"
            mapboxAccessToken={mapBoxToken}
            onClick={(e) => handleClick(e)}
            onLoad={(e) => { handleMapLoad(e) }}
            ref={mapRef}
            cursor="auto"
        >
            {location && <Marker
                longitude={location.lng}
                latitude={location.lat}
                anchor="bottom"
            >
                <img className="w-10 h-10" src='/pin.svg' />
            </Marker>
            }
            {photospots && photospots.map((photospot) => <Marker
                longitude={photospot.lng}
                latitude={photospot.lat}
                anchor="bottom"
                onClick={(e) => handleMarkerClick(e, photospot)}
            >
                <img className="w-10 h-10" src='/pin.svg' />
            </Marker>)
            }

            <GeolocateControl position="top-right" />
            <NavigationControl position="top-right" />

        </MapboxMap>
    )

}