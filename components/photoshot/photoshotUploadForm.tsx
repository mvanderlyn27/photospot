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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import React from "react";
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const uploadPhotoshotSchema = z.object({
  //should add some better requirements for the location

  name: z.string(),
  recreate_text: z.string(),
  //tags for later
  photos: z
    .custom<FileList | null>(
      (val) => val instanceof FileList,
      "Please upload a picture"
    )
    .refine((files) => (files ? files.length > 0 : false), `Required`)
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
});

export default function PhotoshotUploadForm({
  selectedLocation,
}: {
  selectedLocation: Photospot | NewPhotospotInfo;
}) {
  const [loading, setLoading] = useState(false);
  const uploadPhotoshotForm = useForm<z.infer<typeof uploadPhotoshotSchema>>({
    resolver: zodResolver(uploadPhotoshotSchema),
    defaultValues: {
      name: "",
      recreate_text: "",
      photos: null,
    },
  });

  const createNewPhotoshot = async (
    data: z.infer<typeof uploadPhotoshotSchema>
  ) => {
    const formData = new FormData();
    return fetch("/api/photoshot/create", {
      method: "PUT",
      body: formData,
    });
  };
  const onCreate = async (
    data: z.infer<typeof uploadPhotoshotSchema>
  ): Promise<void> => {
    //TODO: optimistic data
    /*
        if existing photospot do somethign else
        FILL THE REST OF THIS OUT
    */
    setLoading(true);
    //need to revalidate cache for photospot/id if existing photospot
    await mutate("/api/photospot/" + selectedLocation.id + "/photoshots");

    // if (data.photos && selectedLocation) {
    //   console.log("creating photoshot");
    //   let photos_form = new FormData();
    //   Array.from(data.photos).forEach((photo) => {
    //     photos_form.append(`photoshot_pictures`, photo);
    //   });
    //   setLoading(true);
    //   const photoshot = await uploadPhotoshot(
    //     data,
    //     photos_form,
    //     selectedLocation
    //   );
    //   if (updatePhotobook) {
    //     await updatePhotobook();
    //   }
    //   setPhotoshotDialogOpen(false);
    //   setLoading(false);
    //   if (photoshot) {
    //     router.push("/photospot/" + photoshot.photospot_id);
    //   }
    //   toast({
    //     title: "Photo Uploaded",
    //   });
    // }
  };

  const clearForm = () => {
    //need to figure out how to properly clear the photos section
    uploadPhotoshotForm.reset();
  };

  return (
    <Form {...uploadPhotoshotForm}>
      <form
        onSubmit={uploadPhotoshotForm.handleSubmit(onCreate)}
        className=" w-full flex flex-col"
      >
        <CardContent className={`flex-1 overflow-auto mb-4 }`}>
          <FormField
            control={uploadPhotoshotForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name this shot:</FormLabel>
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
            control={uploadPhotoshotForm.control}
            name="recreate_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How to:</FormLabel>
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
            control={uploadPhotoshotForm.control}
            name="photos"
            render={({ field: { onChange }, ...field }) => (
              <FormItem>
                <FormLabel>Photos</FormLabel>
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
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                clearForm();
              }}
            >
              Reset
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
