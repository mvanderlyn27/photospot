"use client";
import { Button } from "../ui/button";
import { CardContent, CardFooter, CardTitle } from "../ui/card";
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
export const editPhotospotSchema = z.object({
  name: z
    .string()
    .refine((val) => !NSFWTextMatcher.hasMatch(val), "No Profanity allowed ;)")
    .optional(),
});
export default function EditPhotospotForm({
  photospotName,
  setPhotospotName,
  handleCancel,
  handleSubmit,
}: {
  photospotName: string;
  setPhotospotName: any;
  handleCancel?: any;
  handleSubmit?: any;
}) {
  const editPhotospotForm = useForm<z.infer<typeof editPhotospotSchema>>({
    resolver: zodResolver(editPhotospotSchema),
    defaultValues: {
      name: photospotName,
    },
  });
  const onSubmit = (data: z.infer<typeof editPhotospotSchema>) => {
    setPhotospotName(data.name);
    if (handleSubmit) handleSubmit();
  };
  const clearForm = () => {
    editPhotospotForm.reset();
  };
  return (
    <Form {...editPhotospotForm}>
      <form
        onSubmit={editPhotospotForm.handleSubmit(onSubmit)}
        className=" w-full h-full flex flex-col "
      >
        <CardTitle>
          <h2 className="text-xl font-bold">Edit Location Name</h2>
        </CardTitle>
        <CardContent className={`flex-1 overflow-auto `}>
          <FormField
            control={editPhotospotForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photospot name:</FormLabel>
                <FormControl>
                  <Input className="text-lg" type="text" {...field} />
                </FormControl>
                <FormDescription>
                  Update photospot if you know a better name
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
            <Button type="submit">Save</Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}
