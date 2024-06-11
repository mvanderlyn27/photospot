"use client";
import {
    Card,
    CardContent,
} from "../ui/card";

import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import PhotospotPreview from "./photospotPreview";
import AutoComplete from "../maps/autocomplete";
import { useMap } from "react-map-gl";

export default function LeftWindow({
    viewState,
    setSelectedLocation,
    selectedLocation,
}: {
    viewState: any;
    selectedLocation: Photospot | NewPhotospotInfo | null;
    setSelectedLocation: any;
}) {
    const handleClear = () => {
        setSelectedLocation(null);
    };
    const { photospotMap } = useMap();
    return (
        <Card className="flex flex-col justify-center ">
            <>
                <CardContent className="p-4">
                    <AutoComplete
                        mapRef={photospotMap}
                        setSelectedLocation={setSelectedLocation}
                        selectedLocation={selectedLocation}
                    />
                </CardContent>
            </>
            {selectedLocation && (
                <PhotospotPreview
                    selectedLocation={selectedLocation}
                />
            )}
        </Card>
    );
}
