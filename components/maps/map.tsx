"use client"
import { Map as MapboxMap, GeolocateControl, NavigationControl, Marker, useMap, MarkerEvent, ViewStateChangeEvent, LngLat, MapEvent } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from "react";
import { round } from "@/utils/common/math";
import { Photospot } from "@/types/photospotTypes";
// import { Pin } from '@/media/pin.tsx';
//decides how accurate points should be, I want to not round at all to not lose data in where user places photospot
// just need to see how much info db can take
const LAT_LNG_DIGITS = null;

export default function PhotospotMap({ setMapBounds, setMapLoaded, mapCenter, setMapCenter, location, setLocation, photospots, setViewingPhotospot }: { setMapBounds: any, setMapLoaded: any, mapCenter: LngLat, setMapCenter: any, location: { lat: number, lng: number } | null, setLocation: any, photospots: Photospot[], setViewingPhotospot: any }) {
    const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
    //setup to take options for widht/height
    //allow set location to work for clicking on a location
    const mapRef = useRef<any>(null);
    useEffect(() => {
        if (location) {
            mapRef.current.flyTo({ center: [location.lng, location.lat], })
        }

    }, [location])
    const handleClick = (e: any) => {
        console.log('setLocation', e);
        const lat = round(e.lngLat.lat, LAT_LNG_DIGITS);
        const lng = round(e.lngLat.lng, LAT_LNG_DIGITS);
        mapRef.current.flyTo({ center: [lng, lat], })
        setViewingPhotospot(null);
        setLocation({ lat: lat, lng: lng });
    }

    const handleMarkerClick = (e: any, photospot: Photospot) => {
        e.originalEvent.stopPropagation();
        mapRef.current.flyTo({ center: [photospot.lng, photospot.lat], })
        setViewingPhotospot(photospot);
    }
    const handleMapMove = (e: ViewStateChangeEvent) => {
        setMapCenter(e.target.getCenter());
        setMapBounds(e.target.getBounds());
    }
    const handleMapLoad = (e: MapEvent) => {
        setMapLoaded(true);
        setMapBounds(e.target.getBounds());
    }
    return (
        <MapboxMap
            initialViewState={{
                longitude: mapCenter.lng,
                latitude: mapCenter.lat,
                zoom: 13
            }}
            // reuseMaps={true}
            mapStyle="mapbox://styles/mvanderlyn27/clc8gyohu000114pl9hy6zzdt"
            mapboxAccessToken={mapBoxToken}
            onClick={(e) => handleClick(e)}
            onLoad={(e) => { handleMapLoad(e) }}
            onMoveEnd={(e) => { handleMapMove(e) }}
            ref={mapRef}
            cursor="auto"
        >
            {location && <Marker
                longitude={location.lng}
                latitude={location.lat}
                anchor="bottom"
            >
                <img className="w-10 h-10" src='/selectedPin.svg' />
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