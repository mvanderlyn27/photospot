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
import editPhotospot from "@/app/serverActions/photospots/editPhotospot";

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const editPhotospotSchema = z.object({
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


export default function EditPhotospotDialog({ photospot, setEditPhotospotDialogOpen, updatePhotospot }: { photospot: Photospot | null, setEditPhotospotDialogOpen: any, updatePhotospot: any }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const editPhotospotForm = useForm<z.infer<typeof editPhotospotSchema>>({
        resolver: zodResolver(editPhotospotSchema),
        defaultValues: {
            name: photospot?.name || "",
            description: photospot?.description || "",
            photos: null,
            currentPhotos: photospot?.photo_paths || [],
            photosToRemove: []
        },
    })

    const onEdit = async (data: z.infer<typeof editPhotospotSchema>) => {
        console.log('form info', editPhotospotForm.getValues());
        if (photospot) {
            let photos_form = new FormData();
            if (data.photos) {
                Array.from(data.photos).forEach((photo) => {
                    photos_form.append(`photospot_pictures`, photo);
                })
            }
            setLoading(true);
            await editPhotospot(photospot.id, data, photos_form);
            await updatePhotospot(photospot.id);
            setEditPhotospotDialogOpen(false);
            setLoading(false);
            toast({
                title: "Photospot updated",
            })
        }
    }

    const clearForm = () => {
        //need to figure out how to properly clear the photos section
        editPhotospotForm.reset()
    }
    const handleRemovePicture = (photo: string) => {
        //maybe async remove photo too ?
        editPhotospotForm.setValue("currentPhotos", editPhotospotForm.getValues("currentPhotos")?.filter((p) => p !== photo));
        editPhotospotForm.trigger("currentPhotos");
        const updatedArray = editPhotospotForm.getValues("photosToRemove")
        if (updatedArray) {
            updatedArray.push(photo.split('/').pop() as string);
            editPhotospotForm.setValue("photosToRemove", updatedArray);
            editPhotospotForm.trigger("photosToRemove");
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
            <Form {...editPhotospotForm}>
                <form onSubmit={editPhotospotForm.handleSubmit(onEdit)} className=" w-full flex flex-col">

                    <CardContent className={`flex-1 overflow-auto mb-4 }`}>
                        <FormField
                            control={editPhotospotForm.control}
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
                            control={editPhotospotForm.control}
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
                            control={editPhotospotForm.control}
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
                            {editPhotospotForm.getValues("currentPhotos")?.map((photo) => (
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
                            <Button type="submit" disabled={loading}>Update</Button>
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