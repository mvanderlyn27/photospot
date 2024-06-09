"use client";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Photoshot, Review, ReviewGridInput, Tag } from "@/types/photospotTypes";
import ImageCarousel from "../common/ImageCarousel";
import { useEffect, useState } from "react";
import UploadPhotobookPictureDialog from "./photoshotUploadDialog";
import EditPhotobookPictureDialog from "./editPhotoshotDialog";
import EditPhotoshotDialog from "./editPhotoshotDialog";
import { getPhotoshotTags } from "@/app/serverActions/photoshots/getPhotoshotTags";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";

export default function PhotoshotDialog({
  photoshot,
}: {
  photoshot: Photoshot | undefined;
}) {
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: tags, isLoading: tagLoading, error: tagError } = useSWR("/api/photoshot/" + photoshot?.id + "/tags", fetcher);
  return (
    <>
      {photoshot && <Dialog
        key={photoshot.id}
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditMode(open);
          }
          setDialogOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <div
            key={photoshot.name}
            className="overflow-hidden cursor-pointer aspect-square rounded relative group"
          >
            {photoshot.photo_paths?.length > 0 ? <img
              className="object-cover rounded w-full aspect-square transition duration-300 ease-in-out"
              src={photoshot.photo_paths[0]}
              alt={photoshot.name ? photoshot.name : ""}
            /> : <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />}
            <div className="rounded z-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out absolute from-black/80 to-transparent bg-gradient-to-t inset-x-0 -bottom-2 pt-30 text-white flex justify-center w-full">
              <div>
                <div className="transform-gpu  p-4 space-y-3 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 pb-10 transform transition duration-300 ease-in-out">
                  <div className="font-bold">{photoshot.name} </div>
                  {/* <RatingInput rating={photobookPicture.rating} /> */}
                </div>
              </div>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="p-10 max-w-[50dvw]">
          {!editMode && (
            <div className="flex flex-row">
              <ImageCarousel
                width={"600px"}
                height={"600px"}
                photos={photoshot.photo_paths}
              />
              <div className="flex-col p-8 gap-8  w-full">
                <div className="flex flex-row gap-4 justify-between">
                  <h1 className="text-3xl font-semibold text-left">
                    {photoshot.name}
                  </h1>
                  {photoshot.owner && (
                    <Button onClick={() => setEditMode(true)}>Edit</Button>
                  )}
                </div>
                <h1 className="text-xl  text-left">
                  Created by: {photoshot.username}
                </h1>
                <DialogDescription className="pt-4">
                  <div className=" flex flex-auto gap-2">
                    {tags && tags.map((tag: Tag) => (
                      <Badge key={tag.id} variant="outline">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <h1>
                    <b>How to take the shot: </b>
                    {photoshot.recreate_text}
                  </h1>
                </DialogDescription>
              </div>
            </div>
          )}
          {editMode && (
            <EditPhotoshotDialog
              photoshot={photoshot}
              // updatePhotoshots={updatePhotoshots}
              setPhotoshotDialogOpen={setDialogOpen}
              setEditMode={setEditMode}
            />
          )}
        </DialogContent>
      </Dialog>
      }</>
  );
}
