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
// main behaviors are clicking on a photospot, or not, if one's clicked, this will display info on them, and let you click a button to go to photospot page
// otherwise display the default create form
// if you click back from the photospot view, bring you back to a reset form 
// when you first go to the page it should have a default value, but no photospots are clicked, and no map is clicked, so should be an empty location box
// want to add in a query to the geocoding api via a server action, after you select a location, update the map with the parent location with the selected location

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const createPhotospotSchema = z.object({
    //should add some better requirements for the location
    location: z.string(),
    name: z.string().min(3, {
        message: "name must be atleast 3 letters",
    }),
    description: z.string().optional(),
    //tags for later
    photos: z.custom<FileList | null>((val) => val instanceof FileList, "Required")
        .refine((files) => files ? files.length > 0 : false, `Required`)
        .refine((files) => files ? files.length <= 5 : true, `Maximum of 5 images are allowed.`)
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
        ).optional(),
})

export default function LeftWindow({ location, setLocation }: { location: { lat: number, lng: number }, setLocation: any }) {

    const [photos, setPhotos] = useState<FileList | null>(null)
    const createPhotospotForm = useForm<z.infer<typeof createPhotospotSchema>>({
        resolver: zodResolver(createPhotospotSchema),
        defaultValues: {
            location: '',
            // location: '',
            name: "",
            description: "",
            photos: null
        },
    })
    useEffect(() => {
        if (location) {
            createPhotospotForm.setValue("location", `${round(location.lat, 5)} ${round(location.lng, 5)}`);
        }
    })

    const onCreate = (data: z.infer<typeof createPhotospotSchema>) => {
        console.log('create', data);
    }
    const clearForm = () => {
        //need to figure out how to properly clear the location and photos section
        createPhotospotForm.reset()
        setPhotos(null);
        setLocation(null);


    }
    console.log('leftbar location', location);
    //need some states to control this comp
    // want to be able to search a location, select it to create
    // 2nd view

    //need to get the overflow for the image section working properly here too
    return (
        <Card className="w-full flex flex-col max-h-[calc(100vh-64px-2rem)]">
            <CardHeader className="flex-none">
                <CardTitle>Create Photospot</CardTitle>
                <CardDescription>Search for a location below, or click on map to place a marker</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto mb-4">
                <Form {...createPhotospotForm}>
                    <form onSubmit={createPhotospotForm.handleSubmit(onCreate)} className="space-y-4">
                        <FormField
                            control={createPhotospotForm.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input onChangeCapture={(e) => setLocation({ lat: Number(e.currentTarget.value.split(' ')[0]), lng: Number(e.currentTarget.value.split(' ')[1]) })} type="text" placeholder="" {...field} />
                                    </FormControl>
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
                                        <Input {...field} type="file" multiple={true} onChange={(e) => { setPhotos(e.target.files); onChange(e.target.files); }} />
                                    </FormControl>
                                    <FormDescription>
                                        Upload 1 or more cool photos from the spot
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                {/* <PhotoUploadGrid photos={photos} /> */}
            </CardContent>
            {/* make this part on top of the form, and have the rest of the form scroll */}
            <CardFooter className="flex-none">
                <div className="w-full flex flex-row gap-8 justify-center">
                    <Button variant="outline" onClick={clearForm}>Reset</Button>
                    <Button type="submit">Create</Button>
                </div>
            </CardFooter>
        </Card>
    )
}