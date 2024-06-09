"use client";
import { NewPhotospotInfo, Photoshot, Photospot } from "@/types/photospotTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
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
import createReview from "@/app/serverActions/reviews/createReview";
import uploadPhotobookPicture from "@/app/serverActions/photoshots/uploadPhotoshot";
import { useRouter } from "next/navigation";
import uploadPhotoshot from "@/app/serverActions/photoshots/uploadPhotoshot";
import { cn } from "@/lib/utils";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import PhotoshotUploadForm from "./photoshotUploadForm";

export default function PhotoshotUploadDialog({
  selectedLocation,
  mapView = false
}: {
  selectedLocation: NewPhotospotInfo | Photospot | null;
  mapView: boolean
}) {
  const [photoshotUploadDialogOpen, setPhotoshotUploadDialogOpen] =
    useState(false);

  return (
    <div className={mapView ? "" : `ml-auto `}>
      <Dialog
        open={photoshotUploadDialogOpen}
        onOpenChange={setPhotoshotUploadDialogOpen}
      >
        <DialogTrigger>
          <div
            className={
              "text-2xl  " + cn(buttonVariants({ variant: "default" }))
            }
          >
            Upload a shot
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>
            Upload a pic
            {selectedLocation ? " for " + selectedLocation.location_name : ""}
          </DialogTitle>
          <DialogDescription className="">
            Show off your artsy side, and help other users learn how to make
            better shots
          </DialogDescription>
          {selectedLocation && <PhotoshotUploadForm selectedLocation={selectedLocation} setPhotoshotUploadDialogOpen={setPhotoshotUploadDialogOpen} mapView={mapView} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
