"use client"
import { Map as MapboxMap, GeolocateControl, NavigationControl, Marker, useMap, MarkerEvent, ViewStateChangeEvent, LngLat, MapEvent } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from "react";
import { distanceOnGlobe, round } from "@/utils/common/math";
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import { toast } from "../ui/use-toast";
import { reverseGeocodeLocation } from "@/app/serverActions/maps/reverseGeocodeLocation";
// import { Pin } from '@/media/pin.tsx';
//decides how accurate points should be, I want to not round at all to not lose data in where user places photospot
// just need to see how much info db can take
const LAT_LNG_DIGITS = null;
//distance in meters
const MINIMUM_PHOTOSPOT_DISTANCE = 2;

export default function PhotospotMap({ setMapBounds, setMapLoaded, mapCenter, setMapCenter, selectedLocation, setSelectedLocation, setLoadingSelectedLocation, loadingSelectedLocation, photospots, }: { setMapBounds: any, setMapLoaded: any, mapCenter: LngLat, setMapCenter: any, selectedLocation: Photospot | NewPhotospotInfo | null, setSelectedLocation: any, photospots: Photospot[], setLoadingSelectedLocation: any, loadingSelectedLocation: boolean }) {
    const mapBoxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN : "";
    //setup to take options for widht/height
    //allow set location to work for clicking on a location
    const mapRef = useRef<any>(null);
    useEffect(() => {
        console.log('photospots', photospots);
        if (selectedLocation) {
            mapRef.current.flyTo({ center: [selectedLocation.lng, selectedLocation.lat], })
        }

    }, [selectedLocation])
    const handleClick = (e: any) => {
        console.log('setLocation', e);
        const lat = round(e.lngLat.lat, LAT_LNG_DIGITS);
        const lng = round(e.lngLat.lng, LAT_LNG_DIGITS);
        mapRef.current.flyTo({ center: [lng, lat], })
        //get nearest photospot, if its too close bring up error 

        const photospotDist = photospots.map((photospot) => distanceOnGlobe({ lng: lng, lat: lat }, photospot))
        console.log('distances', photospotDist);
        if (Math.min(...photospotDist) < MINIMUM_PHOTOSPOT_DISTANCE) {
            setSelectedLocation(null);
            toast({ title: "Too close to another photospot", duration: 3000 });
        }
        // getNearestPhotospots(lat, lng, 1).then((photospots) => { //see if its too close })

        //reverse geocode
        setLoadingSelectedLocation(true);
        setSelectedLocation({ lat: lat, lng: lng });
        reverseGeocodeLocation(lat, lng).then((newPhotospotInfo) => {

            setLoadingSelectedLocation(false);
            setSelectedLocation(newPhotospotInfo);
        });
    }

    const handleMarkerClick = (e: any, photospot: Photospot) => {
        e.originalEvent.stopPropagation();
        mapRef.current.flyTo({ center: [photospot.lng, photospot.lat], })
        setSelectedLocation(photospot);
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
            {selectedLocation && <Marker
                longitude={selectedLocation.lng}
                latitude={selectedLocation.lat}
                anchor="bottom"
            >
                <img className="w-10 h-10" src='/selectedPin.svg' />
            </Marker>
            }
            {photospots && photospots.map((photospot) => {
                return <Marker
                    longitude={photospot.lng}
                    latitude={photospot.lat}
                    anchor="bottom"
                    onClick={(e) => handleMarkerClick(e, photospot)}
                >
                    <img className="w-10 h-10" src='/pin.svg' />
                </Marker>
            })
            }

            <GeolocateControl position="top-right" />
            <NavigationControl position="top-right" />

        </MapboxMap>
    )

}