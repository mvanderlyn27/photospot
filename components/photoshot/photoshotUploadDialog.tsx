"use client";
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { buttonVariants } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import PhotoshotUploadForm from "./photoshotUploadForm";
import { MdAddAPhoto } from "react-icons/md";

export default function PhotoshotUploadDialog({
  selectedLocation,
  mapView = false,
}: {
  selectedLocation: NewPhotospotInfo | Photospot | null;
  mapView: boolean;
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
            <MdAddAPhoto className="w-6 h-6 md:w-8 md:h-8" />
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
          {selectedLocation && (
            <PhotoshotUploadForm
              selectedLocation={selectedLocation}
              setPhotoshotUploadDialogOpen={setPhotoshotUploadDialogOpen}
              mapView={mapView}
              handleCancel={() => setPhotoshotUploadDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
