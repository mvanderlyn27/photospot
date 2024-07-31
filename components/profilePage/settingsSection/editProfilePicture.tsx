"use client";
import { DefaultProfile } from "@/utils/common/imageLinks";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaEdit } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../ui/card";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import FileUploadDropzone from "../../common/fileDropZone";
import { toast } from "../../ui/use-toast";
import { useSWRConfig } from "swr";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import SingleFileUploadDropzone from "../../common/singleFileDropZone";
const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const editProfilePictureSchema = z.object({
  photo: z
    .custom<File | null>(
      (val) => val instanceof File && val !== null,
      "Please upload a picture"
    )
    .refine(
      (file) => (file ? file.size : 0) <= MAX_FILE_SIZE,
      `File size should be less than 5 MB.`
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file ? file.type : ""),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    ),
});
export default function EditProfilePicture({
  profileInfo,
}: {
  profileInfo: any;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate } = useSWRConfig();
  const editProfilePictureForm = useForm<
    z.infer<typeof editProfilePictureSchema>
  >({
    resolver: zodResolver(editProfilePictureSchema),
    defaultValues: {
      photo: null,
    },
  });
  const list = {
    noHover: { filter: "brightness(1)" },
    hover: { filter: "brightness(0.7)" },
  };

  const item = {
    noHover: { opacity: 0 },
    hover: { opacity: 1 },
  };
  const handleEdit = async (data: z.infer<typeof editProfilePictureSchema>) => {
    if (data.photo) {
      let formData = new FormData();
      formData.set("photo", data.photo);
      return fetch("/api/profile/edit/profilePicture", {
        body: formData,
        method: "POST",
      }).then((res) => res.json());
    }
  };
  const onEdit = async (data: z.infer<typeof editProfilePictureSchema>) => {
    setLoading(true);
    const newPath = await mutate(
      "/api/profile/editProfilePicture",
      handleEdit(data)
    );
    if (!newPath || newPath?.error) {
      toast({
        title: "Error",
        description: newPath
          ? newPath.error
          : "Something went wrong, please try again",
        variant: "destructive",
      });
    } else {
      mutate("/api/profile", { ...profileInfo, photo_path: newPath });
      setOpen(false);
    }
    setLoading(false);
  };
  const cancelEdit = () => {
    editProfilePictureForm.reset();
    setOpen(false);
    setLoading(false);
  };
  const setPhoto = (file: File) => {
    editProfilePictureForm.setValue("photo", file);
  };
  return (
    <div className="flex flex-row justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <motion.div
            className="cursor-pointer relative"
            whileHover="hover"
            initial="noHover"
            //     onClick={() => {
            //         console.log('open dialog');
            //         setOpen(true);
            //     }}
          >
            <motion.div
              className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] rounded-full overflow-hidden"
              variants={list}
            >
              <Image
                src={
                  profileInfo.photo_path
                    ? profileInfo.photo_path
                    : DefaultProfile
                }
                alt={""}
                fill
                className="object-cover"
              />
            </motion.div>
            <motion.div variants={item}>
              <div className="absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center gap-4 text-white">
                Edit Picture <FaEdit className="w-8 h-8 " />
              </div>
            </motion.div>
          </motion.div>
        </DialogTrigger>
        <DialogContent>
          <CardHeader>
            <CardTitle>Edit Profile Picture</CardTitle>
          </CardHeader>
          <Form {...editProfilePictureForm}>
            <form
              onSubmit={editProfilePictureForm.handleSubmit(onEdit)}
              className=" w-full flex flex-col"
            >
              <CardContent>
                <SingleFileUploadDropzone setPhoto={setPhoto} />
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
              </CardFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
