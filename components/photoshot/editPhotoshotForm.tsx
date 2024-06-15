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
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { NewPhotospotInfo, Photoshot, Photospot, Tag } from "@/types/photospotTypes";
import useSWR, { useSWRConfig } from "swr";
import { isPhotospot } from "@/utils/common/typeGuard";
import { fetcher } from "@/utils/common/fetcher";
import TagSelect, { TagOption, createOption } from "../common/TagSelect";
import { MultiValue } from "react-select";
import FileUploadDropzone from "../common/fileDropZone";
import { imageToFile } from "@/utils/common/file";
import { NSFWTextMatcher } from "@/utils/common/obscenity";
const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
];
export const editPhotoshotSchema = z.object({
    //should add some better requirements for the location

    name: z.string().refine((val) => !NSFWTextMatcher.hasMatch(val), "No Profanity allowed ;)").optional(),
    tags: z.array(z.custom<Tag>(() => true, "")).optional(),
    recreate_text: z.string().refine((val) => !NSFWTextMatcher.hasMatch(val), "No Profanity allowed ;)").optional(),
    //tags for later
    photos: z
        .custom<File[] | null>(
            (val) => !val.some((v: File) => !(v instanceof File)),
            "Please upload a picture"
        )
        .refine(
            (files) => (files ? files.length <= 6 : true),
            `Maximum of 6 images are allowed.`
        )
        .refine((files) =>
            files ? new Set(files.map((file: File) => file.name)).size === files.map((file: File) => file.name).length : true, "Please upload all unique images"
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
    photosToRemove: z.array(z.string()).optional(),
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

    const { mutate } = useSWRConfig();
    const { data: photoshot, mutate: updatePhotoshot, isLoading: photoshotLoading, error: photoshotError, } = useSWR("/api/photoshot/" + photoshotId, fetcher);
    const { data: photoshots, mutate: mutatePhotoshots } = useSWR(() => '/api/photospot/' + photoshot.photospot_id + '/photoshots', fetcher);

    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const initialTags = photoshot?.tags ? photoshot.tags.map((tag: Tag) => (createOption(tag))) : null;
    const [tagValues, setTagValues] = useState<MultiValue<TagOption> | null>(initialTags);
    const [initialFiles, setInitialFiles] = useState<File[]>([]);
    useEffect(() => {
        getInitialFiles().then((files) => setInitialFiles(files));
    }, [])
    setInitialFiles
    const editPhotoshotForm = useForm<z.infer<typeof editPhotoshotSchema>>({
        resolver: zodResolver(editPhotoshotSchema),
        defaultValues: {
            name: photoshot?.name || "",
            tags: [],
            recreate_text: photoshot?.recreate_text || "",
            //photos to upload
            photos: null,
            photosToRemove: photoshot?.photo_paths || null
        },
    });
    const handleEdit = async (data: z.infer<typeof editPhotoshotSchema>) => {
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

    const onEdit = async (
        data: z.infer<typeof editPhotoshotSchema>
    ): Promise<void> => {
        setLoading(true);
        const tempPhotoshot: Photoshot = photoshot;
        if (data.name != undefined) {
            tempPhotoshot.name = data.name
        }
        if (data.recreate_text != undefined) {
            tempPhotoshot.recreate_text = data.recreate_text;
        }
        if (data.tags != undefined) {
            tempPhotoshot.tags = data.tags;

        }

        updatePhotoshot(handleEdit(data), {
            optimisticData: (currentPhotoshot: Photoshot) => ({ ...currentPhotoshot, ...tempPhotoshot }),
            populateCache: (currentPhotoshot: Photoshot) => ({ ...currentPhotoshot, ...tempPhotoshot }),
        }).then(() => {
            //could update optimistically, but lazy rn xD
            // would need to see if there are other photoshots with this tag as well
            // before removing
            // adding, just add it to the existing tag list
            mutate('/api/photospot/' + photoshot.photospot_id + '/tags');
        });


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
        editPhotoshotForm.reset();
        setTagValues(initialTags);
        setEditMode(false);
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
        return fetch("/api/photoshot/" + photoshot.id + "/delete", {
            method: "DELETE",
        }).then(res => res.json());

    };
    const onDelete = async () => {
        mutatePhotoshots(handleDelete(), {
            optimisticData: () => removePhotoshot(photoshots, photoshot.id),
            populateCache: () => removePhotoshot(photoshots, photoshot.id),
        }).then(() => {
            mutate('/api/photospot/' + photoshot.photospot_id + '/tags');
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
    const setPhotos = (photos: File[] | null) => {
        //use initial files to see what are new, and whats old
        //will have an issue if a user uploads a diff file with the same name, won't upload pic 
        if (photos) {

            const curUrls = photos.map((p) => p.name);
            console.log("setPhotos", photos);
            const photos_to_remove = photoshot.photo_paths.filter((p: string) => !curUrls.includes(p));
            const new_photos = photos.filter((p) => !photoshot.photo_paths.includes(p.name));
            editPhotoshotForm.setValue("photos", new_photos);
            editPhotoshotForm.setValue("photosToRemove", photos_to_remove);
        }
    }
    const getInitialFiles = async () => {
        let fileAr: File[] = [];
        if (photoshot) {
            const promiseAr: Promise<void>[] = photoshot.photo_paths.map(async (path: string) => {
                return imageToFile(path).then((fileData: File) => {
                    fileAr.push(fileData)
                })
            })
            await Promise.all(promiseAr);
        }
        return fileAr;
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
                                <FormLabel>Update photos</FormLabel>
                                <FormControl>
                                    {/* <Input
                                        {...field}
                                        type="file"
                                        multiple={true}
                                        onChange={(e) => {
                                            onChange(e.target.files);
                                        }}
                                    /> */}
                                    <FileUploadDropzone curPhotos={initialFiles} setPhotos={setPhotos} />
                                </FormControl>
                                <FormDescription>
                                    add/remove photos for photoshot
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
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
