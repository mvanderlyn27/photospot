"use client";
import { z } from "zod";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { create } from "domain";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import Link from "next/link";
import PhotoUploadGrid from "../common/PhotoUploadGrid";
import { useEffect, useState } from "react";
import { round } from "@/utils/common/math";
import Loading from "../common/Loading";
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import PhotospotPreview from "./photospotPreview";
import {
    SearchBoxFeatureSuggestion,
    SearchBoxSuggestion,
} from "@mapbox/search-js-core";
import {
    retrieveLocation,
    suggestLocations,
} from "@/app/serverActions/maps/searchLocationByName";
import { createClient } from "@/utils/supabase/client";
import { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";
import { User } from "@supabase/supabase-js";
import { useDebouncedCallback } from "use-debounce";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
// import { LocationAutoComplete } from "../maps/autocompleteOld";
import getPhotospotByLocation from "@/app/serverActions/photospots/getPhotospotByLocation";
import AutoComplete from "../maps/autocomplete";
// main behaviors are clicking on a photospot, or not, if one's clicked, this will display info on them, and let you click a button to go to photospot page
// otherwise display the default create form
// if you click back from the photospot view, bring you back to a reset form
// when you first go to the page it should have a default value, but no photospots are clicked, and no map is clicked, so should be an empty location box
// want to add in a query to the geocoding api via a server action, after you select a location, update the map with the parent location with the selected location

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];

export default function LeftWindow({
    mapCenter,
    mapBounds,
    user,
    setSelectedLocation,
    selectedLocation,
    refreshPhotospots,
    loadingSelectedLocation,
}: {
    mapCenter: LngLat;
    user: User | null;
    selectedLocation: Photospot | NewPhotospotInfo | null;
    setSelectedLocation: any;
    refreshPhotospots: any;
    mapBounds: LngLatBounds | null;
    loadingSelectedLocation: boolean;
}) {

    const handleAutoCompleteChange = (suggestion: SearchBoxFeatureSuggestion) => {
        // setSelectedLocation(suggestion);
        getPhotospotByLocation(suggestion.geometry.coordinates[0], suggestion.geometry.coordinates[1]).then((photospot) => {
            if (photospot) {
                console.log("photospot found by location", photospot);
                setSelectedLocation(photospot);
            }
            else {
                console.log("no photospot found");
                //REVERSE GEOCODE LOCATION HERE
                setSelectedLocation({
                    address: suggestion.properties.full_address,
                    neighborhood: suggestion.properties.context.neighborhood ? suggestion.properties.context.neighborhood.name : "",
                    location_name: suggestion.properties.name_preferred ? suggestion.properties.name_preferred : suggestion.properties.name,
                    lat: suggestion.geometry.coordinates[1],
                    lng: suggestion.geometry.coordinates[0],
                });
            }
        })
    };
    const handleClear = () => {
        setSelectedLocation(null);
    }

    return (
        <Card className="flex flex-col justify-center ">
            <>
                <CardContent className="p-4">
                    {/* <LocationAutoComplete
                        onChange={handleAutoCompleteChange}
                        handleClear={handleClear}
                        user={user}
                        mapCenter={mapCenter}
                        selectedLocation={selectedLocation}
                    /> */}
                    <AutoComplete />
                </CardContent>
            </>

            {selectedLocation &&
                <PhotospotPreview
                    selectedLocation={selectedLocation}
                    loadingSelectedLocation={loadingSelectedLocation}
                />
            }
        </Card>
    );
}
