"use client";
import { NewPhotospotInfo, Photospot } from "@/types/photospotTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import PhotoshotUploadForm from "./photoshotUploadForm";
import { MdAddAPhoto } from "react-icons/md";
import { useBreakpoint } from "@/hooks/tailwind";

export default function PhotoshotUploadDialog({
  selectedLocation,
  mapView = false,
}: {
  selectedLocation: NewPhotospotInfo | Photospot | null;
  mapView: boolean;
}) {
  const [photoshotUploadDialogOpen, setPhotoshotUploadDialogOpen] =
    useState(false);
  const { isSm } = useBreakpoint("sm");
  return (
    <Dialog
      open={photoshotUploadDialogOpen}
      onOpenChange={setPhotoshotUploadDialogOpen}
    >
      <DialogTrigger>
        <Button className="h-full">
          {!isSm && <MdAddAPhoto className="w-6 h-6 md:w-8 md:h-8" />}
          {isSm && <h1 className="text-lg">Upload photo</h1>}
        </Button>
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
  );
}
