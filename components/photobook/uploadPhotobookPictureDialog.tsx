"use client"
import { PhotobookPicture, Photospot, Review } from "@/types/photospotTypes";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import createReview from "@/app/serverActions/reviews/createReview";
import uploadPhotobookPicture from "@/app/serverActions/photobook/uploadPhotobookPicture";

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const uploadPhotobookPictureSchema = z.object({
    //should add some better requirements for the location

    name: z.string(),
    description: z.string(),
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


export default function uploadPhotobookPictureDialog({ photospot, setPhotobookPictureDialogOpen, updatePhotobook }: { photospot: Photospot | null, setPhotobookPictureDialogOpen: any, updatePhotobook: any }) {
    const [loading, setLoading] = useState(false);
    const uploadPhotobookPictureForm = useForm<z.infer<typeof uploadPhotobookPictureSchema>>({
        resolver: zodResolver(uploadPhotobookPictureSchema),
        defaultValues: {
            name: "",
            description: "",
            photos: null
        },
    })

    const onCreate = async (data: z.infer<typeof uploadPhotobookPictureSchema>) => {
        if (photospot && data.photos) {
            let photos_form = new FormData();
            Array.from(data.photos).forEach((photo) => {
                photos_form.append(`photobook_pictures`, photo);
            })
            setLoading(true);
            await uploadPhotobookPicture(data, photospot.id, photos_form);
            setLoading(false);
            await updatePhotobook();
            setPhotobookPictureDialogOpen(false);
            toast({
                title: "Photo Uploaded",
            })
        }
    }

    const clearForm = () => {
        //need to figure out how to properly clear the photos section
        uploadPhotobookPictureForm.reset()
    }
    return (
        <div className="flex flex-col gap-2 ">
            <DialogTitle>Upload a pic for {photospot?.name.toLowerCase()}</DialogTitle>
            <DialogDescription className="">Show off your artsy side, and help other users learn how to make better shots</DialogDescription>
            <Form {...uploadPhotobookPictureForm}>
                <form onSubmit={uploadPhotobookPictureForm.handleSubmit(onCreate)} className=" w-full flex flex-col">

                    <CardContent className={`flex-1 overflow-auto mb-4 }`}>
                        <FormField
                            control={uploadPhotobookPictureForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name this angle:</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Give a unique name for this type of picture at this spot
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        <FormField
                            control={uploadPhotobookPictureForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>About this shot:</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Short description about how you got this awesome pic
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={uploadPhotobookPictureForm.control}
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

                    <CardFooter className="flex-none">
                        <div className="w-full flex flex-row gap-8 justify-center">
                            <Button variant="outline" onClick={(e) => { e.preventDefault(); clearForm() }}>Reset</Button>
                            <Button type="submit">Create</Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </div>
    )
}