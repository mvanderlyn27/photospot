"use client"
import LeftWindow from "@/components/createPage/leftWindow";
import PhotospotMap from "@/components/maps/map";
import { useState } from "react";
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import { MapProvider } from "react-map-gl";
import PhotospotsTooCloseDialog from "@/components/createPage/photospotsTooCloseDialog";
// import mapboxgl from 'mapbox-gl';
const INITIAL_LAT: number = 40.72377;
const INITIAL_LNG: number = -73.99837;
export default function CreatePageContainer() {
    //photospot related states
    const [viewState, setViewState] = useState(
        {
            longitude: INITIAL_LNG,
            latitude: INITIAL_LAT,
            zoom: 13,
            bearing: 29
        })
    const [selectedLocation, setSelectedLocation] = useState<Photospot | NewPhotospotInfo | null>(null);
    const [closestPhotospots, setClosestPhotospots] = useState<Photospot[]>([]);
    const [photospotsTooCloseDialogOpen, setPhotospotsTooCloseDialogOpen] = useState<boolean>(false);
    const handlePhotospotTooClose = (photospots: Photospot[]) => {
        setClosestPhotospots(photospots);
        setPhotospotsTooCloseDialogOpen(true);
    }
    return (
        <div className="h-[calc(100vh-64px)] w-screen">

            <MapProvider>
                <div className="absolute top-[64px] left-0 lg:w-[450px] max-h-[calc(100vh-64px)] pl-4 pt-4 z-50">
                    <LeftWindow
                        viewState={viewState}
                        setSelectedLocation={setSelectedLocation}
                        selectedLocation={selectedLocation}
                    />
                </div>
                <div className="h-full w-full">
                    <PhotospotMap
                        viewState={viewState}
                        setViewState={setViewState}
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        handlePhotospotTooClose={handlePhotospotTooClose}
                    />
                </div>
                <PhotospotsTooCloseDialog photospots={closestPhotospots} photospotsTooCloseDialogOpen={photospotsTooCloseDialogOpen} setPhotospotsTooCloseDialogOpen={setPhotospotsTooCloseDialogOpen} setSelectedLocation={setSelectedLocation} />
            </MapProvider>
        </div>
    );
}
