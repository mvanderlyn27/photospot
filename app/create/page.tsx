"use client";
import LeftWindow from '@/components/create/left-window';
import Map from '@/components/maps/map';
import { useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
export default function CreatePage() {
    //move selected lat/lng up to here 
    // can click in map to update selected position being passed down, or search via geocoder in the lefwindow
    // both will update the parent, and propogate to other child
    /*

                    longitude: -73.961321,
                    latitude: 40.766676,
    */
    const [location, setLocation] = useState({ lat: 40.766676, lng: -73.961321 });
    console.log('parent loc', location)
    return (
        <div className="h-[calc(100vh-64px)] w-screen">
            <div className="absolute top-[64px] left-0 w-96 max-h-[calc(100vh-64px)] pl-4 pt-4 z-50">
                <LeftWindow location={location} setLocation={setLocation} />
            </div>
            <div className="h-full w-full">
                <Map location={location} setLocation={setLocation} />
            </div>
        </div>

    )
}