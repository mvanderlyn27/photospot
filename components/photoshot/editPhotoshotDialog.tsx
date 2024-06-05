"use client"
import { Photoshot, Photospot, Review } from "@/types/photospotTypes";
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
import uploadPhotobookPicture from "@/app/serverActions/photoshots/uploadPhotoshot";
import editPhotobookPicture from "@/app/serverActions/photoshots/editPhotobookPicture";
import deletePhotobookPicture from "@/app/serverActions/photoshots/deletePhotobookPicture";

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const editPhotoshotSchema = z.object({
    //should add some better requirements for the location

    name: z.string().optional(),
    recreate_text: z.string().optional(),
    //tags for later
    photos: z.custom<FileList | null>(() => true, "")
        // photos: z.custom<FileList | null>((val) => val instanceof FileList || null, "Please upload a picture")
        //     .refine((files) => files ? files.length > 0 : false, `Required`)
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
    photosToRemove: z.string().array().optional()

})


export default function EditPhotoshotDialog({ photoshot, setEditMode, setPhotoshotDialogOpen, updatePhotoshots }: { photoshot: Photoshot | null, setEditMode: any, setPhotoshotDialogOpen: any, updatePhotoshots: any }) {
    const [loading, setLoading] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const editPhotoshotForm = useForm<z.infer<typeof editPhotoshotSchema>>({
        resolver: zodResolver(editPhotoshotSchema),
        defaultValues: {
            name: photoshot?.name || "",
            recreate_text: photoshot?.recreate_text || "",
            photos: null,
            currentPhotos: photoshot?.photo_paths || [],
            photosToRemove: []
        },
    })

    const onEdit = async (data: z.infer<typeof editPhotoshotSchema>) => {
        if (photoshot) {
            let photos_form = new FormData();
            if (data.photos) {
                Array.from(data.photos).forEach((photo) => {
                    photos_form.append(`photoshot_pictures`, photo);
                })
            }
            setLoading(true);
            await editPhotobookPicture(photoshot.id, data, photoshot.photospot_id, photos_form);
            setLoading(false);
            await updatePhotoshots();
            setEditMode(false);
            toast({
                title: "Edits Saved! :)",
            })
        }
    }

    const cancelEdit = () => {
        //need to figure out how to properly clear the photos section
        editPhotoshotForm.reset()
        setEditMode(false)
    }
    const handleRemovePicture = (photo: string) => {
        //maybe async remove photo too ?
        editPhotoshotForm.setValue("currentPhotos", editPhotoshotForm.getValues("currentPhotos")?.filter((p) => p !== photo));
        editPhotoshotForm.trigger("currentPhotos");
        const updatedArray = editPhotoshotForm.getValues("photosToRemove")
        if (updatedArray) {
            updatedArray.push(photo.split('/').pop() as string);
            editPhotoshotForm.setValue("photosToRemove", updatedArray);
            editPhotoshotForm.trigger("photosToRemove");
        }
    }
    const promptDelete = (setting: boolean) => {
        setConfirmDelete(setting);
    }
    const handleDelete = async () => {
        if (photoshot && confirmDelete) {
            setLoading(true);
            await deletePhotobookPicture(photoshot);
            await updatePhotoshots();
            setPhotoshotDialogOpen(false);
            setLoading(false);
            toast({
                title: "Photobook Picture Deleted",
            });
        }
    }
    return (
        <div className="flex flex-col gap-2 ">
            <DialogTitle>Update info for {photoshot?.name}</DialogTitle>
            <DialogDescription className="">Show off your artsy side, and help other users learn how to make better shots</DialogDescription>
            <Form {...editPhotoshotForm}>
                <form onSubmit={editPhotoshotForm.handleSubmit(onEdit)} className=" w-full flex flex-col">

                    <CardContent className={`flex-1 overflow-auto mb-4 }`}>
                        <FormField
                            control={editPhotoshotForm.control}
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
                            control={editPhotoshotForm.control}
                            name="recreate_text"
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
                            control={editPhotoshotForm.control}
                            name="photos"
                            render={({ field: { onChange }, ...field }) => (
                                <FormItem>
                                    <FormLabel>New Photos</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="file" multiple={true} onChange={(e) => { onChange(e.target.files); }} />
                                    </FormControl>
                                    <FormDescription>
                                        Add new photos here, view/remove existing photos below
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <h1> Current Photos: (click to remove) </h1>
                        <div className="flex ">
                            {editPhotoshotForm.getValues("currentPhotos")?.map((photo) => (
                                <div className="flex flex-col cursor-pointer" key={photo} onClick={() => { handleRemovePicture(photo) }}>
                                    <h1>Name: {photo.split('/').pop()}</h1>
                                    <img className="h-40 w-40 object-cover rounded-md" src={photo} />
                                </div>
                            ))}

                        </div>
                    </CardContent>

                    <CardFooter className="flex-none flex-col gap-4">
                        <div className="w-full flex flex-row gap-8 justify-center">
                            <Button variant="outline" onClick={(e) => { e.preventDefault(); cancelEdit() }}>Cancel</Button>
                            <Button type="submit" disabled={loading}>Save Changes</Button>
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