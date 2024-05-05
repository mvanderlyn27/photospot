"use client";
import LeftWindow from '@/components/create/left-window';
import PhotospotMap from '@/components/maps/map';
import { useEffect, useRef, useState } from 'react';
import { listAllPhotospots } from '../serverActions/photospots/listAll';
import { Photospot } from '@/types/photospotTypes';
// import mapboxgl from 'mapbox-gl';
export default function CreatePage() {
    //move selected lat/lng up to here 
    // can click in map to update selected position being passed down, or search via geocoder in the lefwindow
    // both will update the parent, and propogate to other child
    const [location, setLocation] = useState();
    const [viewingPhotospot, setViewingPhotospot] = useState(false);
    const [photospots, setPhotospots] = useState<Photospot[]>([]);
    const refreshPhotospots = () => {
        listAllPhotospots().then((photospots) => {
            setPhotospots(photospots);
        })
    }
    useEffect(() => {
        refreshPhotospots();
    }, [])
    return (
        <div className="h-[calc(100vh-64px)] w-screen">
            <div className="absolute top-[64px] left-0 w-96 max-h-[calc(100vh-64px)] pl-4 pt-4 z-50">
                <LeftWindow location={location ? location : null} setLocation={setLocation} viewingPhotospot={viewingPhotospot} setViewingPhotospot={setViewingPhotospot} refreshPhotospots={refreshPhotospots} />
            </div>
            <div className="h-full w-full">
                <PhotospotMap location={location ? location : null} setLocation={setLocation} photospots={photospots} setViewingPhotospot={setViewingPhotospot} />
            </div>
        </div>

    )
}