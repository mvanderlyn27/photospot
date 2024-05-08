"use client"
import { z } from "zod";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { create } from "domain";
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import Link from "next/link";
import PhotoUploadGrid from "../common/PhotoUploadGrid";
import { useEffect, useState } from "react";
import { round } from "@/utils/common/math";
import createPhotospot from "@/app/serverActions/photospots/create";
import Loading from "../common/Loading";
import { Photospot } from "@/types/photospotTypes";
import PhotospotPreview from "./photospotPreview";
import { SearchBoxFeatureSuggestion, SearchBoxSuggestion } from "@mapbox/search-js-core";
import { retrieveLocation, suggestLocations } from "@/app/serverActions/maps/searchLocationByName";
import { createClient } from "@/utils/supabase/client";
import { LngLat, LngLatBounds, LngLatLike } from "mapbox-gl";
import { User } from "@supabase/supabase-js";
import { useDebouncedCallback } from "use-debounce";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { LocationAutoComplete } from "../maps/autocomplete";
// main behaviors are clicking on a photospot, or not, if one's clicked, this will display info on them, and let you click a button to go to photospot page
// otherwise display the default create form
// if you click back from the photospot view, bring you back to a reset form 
// when you first go to the page it should have a default value, but no photospots are clicked, and no map is clicked, so should be an empty location box
// want to add in a query to the geocoding api via a server action, after you select a location, update the map with the parent location with the selected location

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const createPhotospotSchema = z.object({
    //should add some better requirements for the location
    location_name: z.string().optional(),
    name: z.string().min(3, {
        message: "name must be atleast 3 letters",
    }),
    description: z.string().optional(),
    //tags for later
    photos: z.custom<FileList | null>((val) => val instanceof FileList, "Please upload a picture")
        .refine((files) => files ? files.length > 0 : false, `Required`)
        .refine((files) => files ? files.length <= 4 : true, `Maximum of 4 images are allowed.`)
        .refine(
            (files) =>
                files ? Array.from(files).every((file) => file.size <= MAX_FILE_SIZE) : true,
            `Each file size should be less than 5 MB.`
        )
        .refine(
            (files) =>
                files ? Array.from(files).every((file) =>
                    ACCEPTED_IMAGE_TYPES.includes(file.type)
                ) : true,
            "Only these types are allowed .jpg, .jpeg, .png and .webp"
        )
})

export default function LeftWindow({ mapBounds, mapCenter, user, location, setLocation, viewingPhotospot, setViewingPhotospot, refreshPhotospots }: { mapCenter: LngLat, user: User | null, location: { lat: number, lng: number } | null, setLocation: any, viewingPhotospot: Photospot | undefined, setViewingPhotospot: any, refreshPhotospots: any, mapBounds: LngLatBounds | null }) {
    const supabase = createClient();
    const [loading, setLoading] = useState(false)
    const [selectedLocation, setSelectedLocation] = useState<SearchBoxFeatureSuggestion | null>(null);

    const createPhotospotForm = useForm<z.infer<typeof createPhotospotSchema>>({
        resolver: zodResolver(createPhotospotSchema),
        defaultValues: {
            location_name: "",
            name: "",
            description: "",
            photos: null
        },
    })

    const onCreate = async (data: z.infer<typeof createPhotospotSchema>) => {
        //need to ensure a location when submitting form 
        if (location && data.photos) {
            let photos_form = new FormData();
            let i = 0
            Array.from(data.photos).forEach((photo) => {
                photos_form.append(`photospot_pictures`, photo);
                i += 1;
            })
            setLoading(true);
            createPhotospot(data, location, photos_form).then((photospot) => {
                refreshPhotospots()
                setViewingPhotospot(photospot);
                clearForm();
                setLoading(false);
            });
        }
        else {
            console.log('setting error');
            createPhotospotForm.setError('location_name', { message: 'Please select a location on the map, or search here' });
        }
    }
    const clearForm = () => {
        //need to figure out how to properly clear the photos section
        setLocation(null);
        createPhotospotForm.reset()
    }

    const handleAutoCompleteChange = (suggestion: SearchBoxFeatureSuggestion) => {
        console.log('latlng', suggestion.geometry.coordinates);
        setLocation({ lat: suggestion.geometry.coordinates[1], lng: suggestion.geometry.coordinates[0] })
        setSelectedLocation(suggestion);
        createPhotospotForm.setValue('location_name', suggestion.properties.name);
    }
    //need some states to control this comp
    // want to be able to search a location, select it to create
    // 2nd view

    //need to get the overflow for the image section working properly here too
    return (
        <Card className="flex flex-col justify-center ">
            {!viewingPhotospot ?
                <Form {...createPhotospotForm}>
                    <form onSubmit={createPhotospotForm.handleSubmit(onCreate)} className=" w-full flex flex-col max-h-[calc(100vh-64px-2rem)]">
                        <CardHeader className="flex-none">
                            <CardTitle className="text-3xl">Create Photospot</CardTitle>
                            <CardDescription>Search for a location below, or click on map to place a marker</CardDescription>
                        </CardHeader>

                        <CardContent className={`flex-1 overflow-auto mb-4 ${loading ? 'hidden' : ''}`}>
                            <FormField
                                control={createPhotospotForm.control}
                                name="location_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location {location ? `(${round(location.lat, 2)},${round(location.lng, 2)})` : ''}</FormLabel>
                                        <FormControl>
                                            {/* <Input {...field} onFocus={() => setSuggestionsOpen(true)} onBlur={() => { field.onBlur();}} onChange={(e) => { field.onChange(e); debouncedSuggestLocation(e.target.value) }} /> */}
                                            <LocationAutoComplete user={user} mapCenter={mapCenter} onChange={handleAutoCompleteChange} />
                                        </FormControl>

                                        {/* {suggestionsOpen && suggestedLocations.length > 0 && suggestedLocations.map((suggestion) =>
                                            <LocationResults suggestion={suggestion} handleClick={() => retrieveLocationInfo(suggestion)} />
                                        )} */}

                                        <FormDescription>
                                            Either type a location, or click on the map
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField
                                control={createPhotospotForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Please enter name for photospot
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField
                                control={createPhotospotForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Short description about why this location is cool
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            <FormField
                                control={createPhotospotForm.control}
                                name="photos"
                                render={({ field: { onChange }, ...field }) => (
                                    <FormItem>
                                        <FormLabel>Photos</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="file" multiple={true} onChange={(e) => { onChange(e.target.files); }} />
                                        </FormControl>
                                        <FormDescription>
                                            Upload 1 or more cool photos from the spot
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        {/* <PhotoUploadGrid photos={photos} /> */}


                        <div className={`pb-4 ${loading ? '' : 'hidden'}`}>
                            <Loading />
                        </div>

                        <CardFooter className="flex-none">
                            <div className="w-full flex flex-row gap-8 justify-center">
                                <Button variant="outline" onClick={(e) => { e.preventDefault(); clearForm() }}>Reset</Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </CardFooter>
                    </form>
                </Form>
                :
                <PhotospotPreview photospot={viewingPhotospot} setViewingPhotospot={setViewingPhotospot} />}
        </Card >
    )
}