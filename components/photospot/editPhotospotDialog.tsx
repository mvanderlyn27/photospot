"use client"
import { Photospot, Review } from "@/types/photospotTypes";
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
import deletePhotospot from "@/app/serverActions/photospots/deletePhotospot";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const createReviewSchema = z.object({
    //should add some better requirements for the location
    name: z.string().optional(),
    description: z.string(),
    //tags for later
    photos: z.custom<FileList | null>(() => true, "")
        // .refine((files) => files ? files.length > 0 : false, `Required`)
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
        ),
    currentPhotos: z.string().array().optional(),
    photosToRemove: z.string().array().optional(),

})


export default function EditPhotospotDialog({ photospot, setEditPhotospotDialogOpen }: { photospot: Photospot | null, setEditPhotospotDialogOpen: any, }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const createReviewForm = useForm<z.infer<typeof createReviewSchema>>({
        resolver: zodResolver(createReviewSchema),
        defaultValues: {
            name: photospot?.name || "",
            description: photospot?.description || "",
            photos: null,
            currentPhotos: photospot?.photo_paths || [],
            photosToRemove: []
        },
    })

    const onCreate = async (data: z.infer<typeof createReviewSchema>) => {
        console.log('form info', createReviewForm.getValues());
        // if (photospot && data.photos) {
        //     let photos_form = new FormData();
        //     Array.from(data.photos).forEach((photo) => {
        //         photos_form.append(`review_pictures`, photo);
        //     })
        //     setLoading(true);
        //     await createReview(data, photospot.id, photos_form);
        //     setLoading(false);
        //     setEditPhotospotDialogOpen(false);
        //     toast({
        //         title: "Review Submitted",
        //     })
        // }
    }

    const clearForm = () => {
        //need to figure out how to properly clear the photos section
        createReviewForm.reset()
    }
    const handleRemovePicture = (photo: string) => {
        //maybe async remove photo too ?
        createReviewForm.setValue("currentPhotos", createReviewForm.getValues("currentPhotos")?.filter((p) => p !== photo));
        createReviewForm.trigger("currentPhotos");
        const updatedArray = createReviewForm.getValues("photosToRemove")
        if (updatedArray) {
            updatedArray.push(photo.split('/').pop() as string);
            createReviewForm.setValue("photosToRemove", updatedArray);
            createReviewForm.trigger("photosToRemove");
        }
    }
    const promptDelete = (setting: boolean) => {
        setConfirmDelete(setting);
    }
    const handleDelete = async () => {
        if (photospot && confirmDelete) {
            setLoading(true);
            await deletePhotospot(photospot.id);
            setLoading(false);
            //update photospot
            // await updatePhotospot();
            router.back()
            toast({
                title: "Photospot Deleted",
            });
        }
    }
    return (
        <div className="flex flex-col gap-2 ">
            <DialogTitle>Edit {photospot?.name}?</DialogTitle>
            <DialogDescription className="">Update fields for photospot (except location)</DialogDescription>
            <Form {...createReviewForm}>
                <form onSubmit={createReviewForm.handleSubmit(onCreate)} className=" w-full flex flex-col">

                    <CardContent className={`flex-1 overflow-auto mb-4 }`}>
                        <FormField
                            control={createReviewForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Update Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Update the photospot name here
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={createReviewForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Update Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Update the photospots description here
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={createReviewForm.control}
                            name="photos"
                            render={({ field: { onChange }, ...field }) => (
                                <FormItem>
                                    <FormLabel>Add Photos</FormLabel>
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
                        <h1> Current Photos: (click to remove) </h1>
                        <div className="flex ">
                            {createReviewForm.getValues("currentPhotos")?.map((photo) => (
                                <div className="flex flex-col cursor-pointer" key={photo} onClick={() => { handleRemovePicture(photo) }}>
                                    <h1>Name: {photo.split('/').pop()}</h1>
                                    <img className="h-40 w-40 object-cover rounded-md" src={photo} />
                                </div>
                            ))}

                        </div>
                    </CardContent>

                    <CardFooter className="flex-none flex-col gap-4">
                        <div className="w-full flex flex-row gap-8 justify-center">
                            <Button variant="outline" onClick={(e) => { e.preventDefault(); clearForm() }}>Reset</Button>
                            <Button type="submit">Update</Button>
                        </div>
                        <div className="w-full flex flex-row gap-8 justify-center">
                            {!confirmDelete && <Button variant="destructive" onClick={(e) => { e.preventDefault(); promptDelete(true) }}>Delete</Button>}
                            {confirmDelete && <Button variant="outline" onClick={(e) => { e.preventDefault(); promptDelete(false) }}>Cancel Delete</Button>}
                            {confirmDelete && <Button variant="destructive" onClick={(e) => { e.preventDefault(); handleDelete() }}>Confirm Delete</Button>}
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </div>
    )
}