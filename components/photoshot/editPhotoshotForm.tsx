"use client";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { NewPhotospotInfo, Photoshot, Photospot, Tag } from "@/types/photospotTypes";
import useSWR, { useSWRConfig } from "swr";
import { isPhotospot } from "@/utils/common/typeGuard";
import { fetcher } from "@/utils/common/fetcher";
import TagSelect, { TagOption, createOption } from "../common/TagSelect";
import { MultiValue } from "react-select";
const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
export const editPhotoshotSchema = z.object({
    //should add some better requirements for the location

    name: z.string().optional(),
    tags: z.array(z.custom<Tag>(() => true, "")).optional(),
    recreate_text: z.string().optional(),
    //tags for later
    photos: z
        .custom<FileList | null>(() => true, "")
        // photos: z.custom<FileList | null>((val) => val instanceof FileList || null, "Please upload a picture")
        //     .refine((files) => files ? files.length > 0 : false, `Required`)
        .refine(
            (files) => (files ? files.length <= 4 : true),
            `Maximum of 4 images are allowed.`
        )
        .refine(
            (files) =>
                files
                    ? Array.from(files).every((file) => file.size <= MAX_FILE_SIZE)
                    : true,
            `Each file size should be less than 5 MB.`
        )
        .refine(
            (files) =>
                files
                    ? Array.from(files).every((file) =>
                        ACCEPTED_IMAGE_TYPES.includes(file.type)
                    )
                    : true,
            "Only these types are allowed .jpg, .jpeg, .png and .webp"
        ),
    currentPhotos: z.string().array().optional(),
    photosToRemove: z.string().array().optional(),
});

export default function EditPhotoshotForm({
    photoshotId,
    setPhotoshotDialogOpen,
    setEditMode,
    handleSubmit,
}: {
    photoshotId: number;
    setPhotoshotDialogOpen: any;
    setEditMode: any;
    handleSubmit?: any
}) {

    // const { mutate } = useSWRConfig();
    const { data: photoshot, mutate: updatePhotoshot, isLoading: photoshotLoading, error: photoshotError, } = useSWR("/api/photoshot/" + photoshotId, fetcher);
    const { data: photoshots, mutate: mutatePhotoshots } = useSWR(() => '/api/photospot/' + photoshot.photospot_id + '/photoshots', fetcher);

    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const initialTags = photoshot?.tags ? photoshot.tags.map((tag: Tag) => (createOption(tag))) : null;
    const [tagValues, setTagValues] = useState<MultiValue<TagOption> | null>(initialTags);
    const editPhotoshotForm = useForm<z.infer<typeof editPhotoshotSchema>>({
        resolver: zodResolver(editPhotoshotSchema),
        defaultValues: {
            name: photoshot?.name || "",
            tags: [],
            recreate_text: photoshot?.recreate_text || "",
            photos: null,
            currentPhotos: photoshot?.photo_paths || [],
            photosToRemove: [],
        },
    });

    const handleEdit = async (data: z.infer<typeof editPhotoshotSchema>) => {

        // if (photoshot) {
        //     let photos_form = new FormData();
        //     if (data.photos) {
        //         Array.from(data.photos).forEach((photo) => {
        //             photos_form.append(`photoshot_pictures`, photo);
        //         });
        //     }
        //     setLoading(true);
        //     await editPhotoshot(
        //         photoshot.id,
        //         data,
        //         photoshot.photospot_id,
        //         photos_form
        //     );
        //     setLoading(false);
        //     // await updatePhotoshots();
        //     setEditMode(false);
        //     toast({
        //         title: "Edits Saved! :)",
        //     });
        // }
        let formData = new FormData();
        if (data.photos) {
            Array.from(data.photos).forEach((photo) => {
                formData.append(`photos`, photo);
            });
        }
        formData.append(`data`, JSON.stringify(data));
        return fetch("/api/photoshot/" + photoshot.id + "/edit", {
            method: "PUT",
            body: formData,
        }).then(res => res.json());
    };
    const replacePhotoshot = (photoshots: Photoshot[], oldPhotoshot: Photoshot, newPhotoshot: Photoshot) => {
        return photoshots.map((photoshot: Photoshot) => {
            if (photoshot.id === oldPhotoshot.id) {
                return newPhotoshot;
            }
            return photoshot;
        });
    }
    const onEdit = async (
        data: z.infer<typeof editPhotoshotSchema>
    ): Promise<void> => {
        //TODO: fix optimistic data 
        setLoading(true);
        //need to revalidate cache for photospot/id if existing photospot
        const tempPhotoshot: Photoshot = photoshot;
        if (data.name != undefined) {
            tempPhotoshot.name = data.name
        }
        if (data.recreate_text != undefined) {
            tempPhotoshot.recreate_text = data.recreate_text;
        }
        if (data.tags != undefined) {
            //either get the new tags from db here and await, or seperate tags?
            // maybe get general info on main page, and more advanced info when opening dialog?
            tempPhotoshot.tags = data.tags;

        }
        //issue here when adding new tags
        //update new tag on photoshot route
        //update photospot route
        console.log('tempPhotoshot, for optimistic', tempPhotoshot);
        updatePhotoshot(handleEdit(data), {
            optimisticData: (currentPhotoshot: Photoshot) => ({ ...currentPhotoshot, ...tempPhotoshot }),
            populateCache: (currentPhotoshot: Photoshot) => ({ ...currentPhotoshot, ...tempPhotoshot }),
        });
        // mutatePhotoshots();
        // mutatePhotoshots(handleEdit(data), {
        //     optimisticData: (curPhotoshots: Photoshot[]) => replacePhotoshot(curPhotoshots, photoshot, tempPhotoshot),
        //     populateCache: (updatedPhotoshot: Photoshot, curPhotoshots: Photoshot[]) => replacePhotoshot(curPhotoshots, photoshot, updatedPhotoshot),
        // });
        toast({
            title: "Edited Photoshot",
        })
        setLoading(false);
        setEditMode(false);
        if (handleSubmit) {
            handleSubmit();
        }
    };

    const cancelEdit = () => {
        //need to figure out how to properly clear the photos section
        editPhotoshotForm.reset();
        setTagValues(initialTags);
        setEditMode(false);
    };
    const handleRemovePicture = (photo: string) => {
        //maybe async remove photo too ?
        editPhotoshotForm.setValue(
            "currentPhotos",
            editPhotoshotForm.getValues("currentPhotos")?.filter((p) => p !== photo)
        );
        editPhotoshotForm.trigger("currentPhotos");
        const updatedArray = editPhotoshotForm.getValues("photosToRemove");
        if (updatedArray) {
            updatedArray.push(photo.split("/").pop() as string);
            editPhotoshotForm.setValue("photosToRemove", updatedArray);
            editPhotoshotForm.trigger("photosToRemove");
        }
    };
    const promptDelete = (setting: boolean) => {
        setConfirmDelete(setting);
    };
    const removePhotoshot = (photoshots: number[], photoshotId: number): number[] => {
        if (photoshots) {
            return photoshots.filter((id) => id !== photoshotId);
        }
        else {
            return []
        }
    }
    const handleDelete = async () => {
        // if (photoshot && confirmDelete) {
        //     setLoading(true);
        //     await deletePhotobookPicture(photoshot);
        //     // await updatePhotoshots();
        //     setPhotoshotDialogOpen(false);
        //     setLoading(false);
        //     toast({
        //         title: "Photobook Picture Deleted",
        //     });
        // }
        return fetch("/api/photoshot/" + photoshot.id + "/delete", {
            method: "DELETE",
        }).then(res => res.json());

    };
    const onDelete = async () => {
        // updatePhotoshot(handleDelete(), {
        //     optimisticData: (curPhotoshots: Photoshot[]) => removePhotoshot(curPhotoshots, photoshot),
        //     // populateCache: (curPhotoshots: Photoshot[]) => removePhotoshot(curPhotoshots, photoshot),
        // });
        mutatePhotoshots(handleDelete(), {
            optimisticData: () => removePhotoshot(photoshots, photoshot.id),
            populateCache: () => removePhotoshot(photoshots, photoshot.id),
        });
        setPhotoshotDialogOpen(false);
        toast({
            title: "Photoshot Deleted",
        })
        if (handleSubmit) {
            handleSubmit();
        }

    }


    const setSelectedTags = (selectedTags: Tag[]) => {
        console.log('selectedTags', selectedTags);
        if (selectedTags) {
            editPhotoshotForm.setValue("tags", selectedTags);
        }
    }
    const setTagError = (tagError: Error) => {
        console.log("tagError", tagError);
        if (tagError) {
            editPhotoshotForm.setError("tags", { type: 'manual', message: tagError.message });
        }
        else {
            editPhotoshotForm.clearErrors("tags");
        }
    }

    return (
        <Form {...editPhotoshotForm}>
            <form
                onSubmit={editPhotoshotForm.handleSubmit(onEdit)}
                className=" w-full flex flex-col"
            >
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
                        )}
                    />
                    <FormField
                        control={editPhotoshotForm.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags:</FormLabel>
                                <FormControl>
                                    <TagSelect tagValues={tagValues} setTagValues={setTagValues} setSelectedTags={setSelectedTags} setTagError={setTagError} />
                                </FormControl>
                                <FormDescription>
                                    Upload tags for this shot here
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                        )}
                    />
                    <FormField
                        control={editPhotoshotForm.control}
                        name="photos"
                        render={({ field: { onChange }, ...field }) => (
                            <FormItem>
                                <FormLabel>New Photos</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="file"
                                        multiple={true}
                                        onChange={(e) => {
                                            onChange(e.target.files);
                                        }}
                                    />
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
                            <div
                                className="flex flex-col cursor-pointer"
                                key={photo}
                                onClick={() => {
                                    handleRemovePicture(photo);
                                }}
                            >
                                <h1>Name: {photo.split("/").pop()}</h1>
                                <img
                                    className="h-40 w-40 object-cover rounded-md"
                                    src={photo}
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="flex-none flex-col gap-4">
                    <div className="w-full flex flex-row gap-8 justify-center">
                        <Button
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                cancelEdit();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            Save Changes
                        </Button>
                    </div>
                    <div className="w-full flex flex-row gap-8 justify-center">
                        {!confirmDelete && (
                            <Button
                                variant="destructive"
                                onClick={(e) => {
                                    e.preventDefault();
                                    promptDelete(true);
                                }}
                            >
                                Delete
                            </Button>
                        )}
                        {confirmDelete && (
                            <Button
                                variant="outline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    promptDelete(false);
                                }}
                            >
                                Cancel Delete
                            </Button>
                        )}
                        {confirmDelete && (
                            <Button
                                variant="destructive"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDelete();
                                }}
                            >
                                Confirm Delete
                            </Button>
                        )}
                    </div>
                </CardFooter>
            </form>
        </Form>
    );
}
