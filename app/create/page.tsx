"use client";
import LeftWindow from "@/components/create/left-window";
import PhotospotMap from '@/components/maps/map';
import { useEffect, useRef, useState } from 'react';
import { listAllPhotospots } from '../serverActions/photospots/listAllPhotospots';
import { Photospot } from '@/types/photospotTypes';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { LngLat, LngLatBounds } from 'mapbox-gl';
// import mapboxgl from 'mapbox-gl';
const INITIAL_LAT: number = 40.72377;
const INITIAL_LNG: number = -73.99837;
export default function CreatePage() {
    //move selected lat/lng up to here 
    // can click in map to update selected position being passed down, or search via geocoder in the lefwindow
    // both will update the parent, and propogate to other child
    const router = useRouter();
    const [location, setLocation] = useState();
    const [viewingPhotospot, setViewingPhotospot] = useState();
    const [photospots, setPhotospots] = useState<Photospot[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const [mapCenter, setMapCenter] = useState<LngLat>(new LngLat(INITIAL_LNG, INITIAL_LAT));
    const [mapBounds, setMapBounds] = useState<LngLatBounds | null>(null);
    const refreshPhotospots = () => {
        listAllPhotospots().then((photospots) => {
            setPhotospots(photospots);
        })
        const supabase = createClient();
        supabase.auth.getUser().then((user) => {
            if (!user.data.user) {
                router.push('/');
            }
            setUser(user.data.user);
        })

    }
    useEffect(() => {
        refreshPhotospots();
    }, [])
    return (
        <div className="h-[calc(100vh-64px)] w-screen">
            <div className="absolute top-[64px] left-0 lg:w-[450px] max-h-[calc(100vh-64px)] pl-4 pt-4 z-50">
                <LeftWindow mapBounds={mapBounds} mapCenter={mapCenter} user={user} location={location ? location : null} setLocation={setLocation} viewingPhotospot={viewingPhotospot} setViewingPhotospot={setViewingPhotospot} refreshPhotospots={refreshPhotospots} />
            </div>
            <div className="h-full w-full">
                <PhotospotMap setMapBounds={setMapBounds} mapCenter={mapCenter} setMapCenter={setMapCenter} location={location ? location : null} setLocation={setLocation} photospots={photospots} setViewingPhotospot={setViewingPhotospot} />
            </div>
        </div>

    )
}