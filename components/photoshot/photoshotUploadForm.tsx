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
import { ErrorOption, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import {
  NewPhotospotInfo,
  Photoshot,
  Photospot,
  Tag,
} from "@/types/photospotTypes";
import useSWR, { useSWRConfig } from "swr";
import { isPhotospot } from "@/utils/common/typeGuard";
import { fetcher } from "@/utils/common/fetcher";
import CreateTagSelect, { TagOption } from "../common/createTagSelect";
import { MultiValue } from "react-select";
import FileUploadDropzone from "../common/fileDropZone";
import { NSFWTextMatcher } from "@/utils/common/obscenity";
const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const uploadPhotoshotSchema = z.object({
  //should add some better requirements for the location
  name: z
    .string({ message: "Please enter a name" })
    .min(1, "Required")
    .refine((val) => !NSFWTextMatcher.hasMatch(val), "No Profanity allowed ;)"),
  recreate_text: z
    .string({ message: "Please enter a name" })
    .min(1, "Required")
    .refine((val) => !NSFWTextMatcher.hasMatch(val), "No Profanity allowed ;)"),
  tags: z.array(z.custom<Tag>(() => true, "")).optional(),
  photos: z
    .custom<File[] | null>(
      (val) => !val?.some((v: File) => !(v instanceof File)),
      "Please upload a picture"
    )
    .refine((files) => (files ? files.length > 0 : false), `Required`)
    .refine(
      (files) => (files ? files.length <= 6 : true),
      `Maximum of  images are allowed.`
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
          ? new Set(files.map((file: File) => file.name)).size ===
            files.map((file: File) => file.name).length
          : true,
      "Please upload all unique images"
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
});
export default function PhotoshotUploadForm({
  selectedLocation,
  setPhotoshotUploadDialogOpen,
  handleSubmit,
  handleCancel,
  mapView,
}: {
  selectedLocation: Photospot | NewPhotospotInfo;
  setPhotoshotUploadDialogOpen?: any;
  handleSubmit?: any;
  handleCancel?: any;
  mapView: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [tagValues, setTagValues] = useState<MultiValue<TagOption> | null>(
    null
  );
  const { data: photoshots, mutate: mutatePhotoshots } = useSWR(
    isPhotospot(selectedLocation)
      ? "/api/photospot/" + selectedLocation.id + "/photoshots"
      : null,
    fetcher
  );
  const [initialFiles, setInitialFiles] = useState<File[]>([]);
  const uploadPhotoshotForm = useForm<z.infer<typeof uploadPhotoshotSchema>>({
    resolver: zodResolver(uploadPhotoshotSchema),
    defaultValues: {
      name: "",
      tags: [],
      recreate_text: "",
      photos: null,
    },
  });

  const createNewPhotoshot = async (
    data: z.infer<typeof uploadPhotoshotSchema>,
    selectedLocation: Photospot | NewPhotospotInfo
  ) => {
    let formData = new FormData();
    if (data.photos) {
      Array.from(data.photos).forEach((photo: File) => {
        formData.append(`photos`, photo);
      });
    }
    formData.append(`data`, JSON.stringify(data));
    formData.append(`selectedLocation`, JSON.stringify(selectedLocation));
    return fetch("/api/photoshot/create", {
      method: "PUT",
      body: formData,
    }).then((res) => res.json());
  };
  const onCreate = async (
    data: z.infer<typeof uploadPhotoshotSchema>
  ): Promise<void> => {
    setLoading(true);
    toast({
      title: "Uploading... ",
    });
    if (isPhotospot(selectedLocation)) {
      const tempPhotoshot: Photoshot = {
        name: data.name,
        recreate_text: data.recreate_text,
        photospot_id: selectedLocation.id,
        id: 0,
        photo_paths: [],
      };
      mutatePhotoshots(createNewPhotoshot(data, selectedLocation), {
        optimisticData: (curPhotoshots: Photoshot[]) => [
          tempPhotoshot,
          ...curPhotoshots,
        ],
        populateCache: (
          updatedPhotoshot: Photoshot,
          curPhotoshots: Photoshot[]
        ) => [updatedPhotoshot, ...curPhotoshots],
      }).then(() => {
        if (mapView) {
          //happens on map view but selecting existing photospot
          router.push("/photospot/" + selectedLocation.id);
          setLoading(false);
          if (setPhotoshotUploadDialogOpen) setPhotoshotUploadDialogOpen(false);
          toast({
            title: "Uploaded Photoshot",
          });
        }
      });
    } else {
      const photoshot = await createNewPhotoshot(data, selectedLocation);
      if (mapView) {
        //happens when new photospot selected from map
        router.push("/photospot/" + photoshot.photospot_id);
        setLoading(false);
        if (setPhotoshotUploadDialogOpen) setPhotoshotUploadDialogOpen(false);
        toast({
          title: "Uploaded Photoshot",
        });
      }
    }
    if (!mapView) {
      //happens on photospot view page
      setLoading(false);
      if (setPhotoshotUploadDialogOpen) setPhotoshotUploadDialogOpen(false);
      toast({
        title: "Uploaded Photoshot",
      });
    }

    if (handleSubmit) {
      handleSubmit();
    }
  };
  const setSelectedTags = (selectedTags: Tag[]) => {
    console.log("selectedTags", selectedTags);
    if (selectedTags) {
      uploadPhotoshotForm.setValue("tags", selectedTags);
    }
  };
  const setTagError = (tagError: Error) => {
    console.log("tagError", tagError);
    if (tagError) {
      uploadPhotoshotForm.setError("tags", {
        type: "manual",
        message: tagError.message,
      });
    } else {
      uploadPhotoshotForm.clearErrors("tags");
    }
  };
  const setPhotos = (photos: File[] | null) => {
    // add some custom logic to keep track of the files that exist that need to be removed,
    // and the new ones, revist backend logic, see if its easier if we keep track of both,
    // or if theres a better way
    console.log("setPhotos", photos);
    uploadPhotoshotForm.setValue("photos", photos);
  };

  const clearForm = () => {
    //need to figure out how to properly clear the photos section
    uploadPhotoshotForm.reset();
    setTagValues(null);
  };

  return (
    <Form {...uploadPhotoshotForm}>
      <form
        onSubmit={uploadPhotoshotForm.handleSubmit(onCreate)}
        className=" w-full flex flex-col"
      >
        <CardContent className={`flex-1 overflow-auto`}>
          <FormField
            control={uploadPhotoshotForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name this shot:</FormLabel>
                <FormControl>
                  <Input className="text-lg" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Give a unique name for this type of picture at this spot
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={uploadPhotoshotForm.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags:</FormLabel>
                <FormControl>
                  <CreateTagSelect
                    tagValues={tagValues}
                    setTagValues={setTagValues}
                    setSelectedTags={setSelectedTags}
                    setTagError={setTagError}
                  />
                </FormControl>
                <FormDescription>
                  Upload tags for this shot here
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={uploadPhotoshotForm.control}
            name="recreate_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How to:</FormLabel>
                <FormControl>
                  <Textarea className="text-lg" {...field} />
                </FormControl>
                <FormDescription>
                  Short description about how you got this awesome pic
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={uploadPhotoshotForm.control}
            name="photos"
            // render={({ field: { onChange }, ...field }) => (
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photos</FormLabel>
                <FormControl>
                  {/* <Input
                    {...field}
                    type="file"
                    multiple={true}
                    onChange={(e) => {
                      onChange(e.target.files);
                    }}
                  /> */}
                  <FileUploadDropzone
                    curPhotos={initialFiles}
                    setPhotos={setPhotos}
                  />
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
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                clearForm();
                if (handleCancel) handleCancel();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              Create
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}
