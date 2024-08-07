"use client";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { Tag } from "@/types/photospotTypes";
import ImageCarousel from "../common/ImageCarousel";
import { useEffect, useState } from "react";
import EditPhotoshotDialog from "./editPhotoshotDialog";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";

export default function PhotoshotDialog({
  photoshotId,
}: {
  photoshotId: number;
}) {
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data: photoshot,
    mutate: updatePhotoshot,
    isLoading: photoshotLoading,
    error: photoshotError,
  } = useSWR("/api/photoshot/" + photoshotId, fetcher);
  const {
    data: isLiked,
    mutate: updateLiked,
    isLoading: likedLoading,
    error: likedError,
  } = useSWR("/api/photoshot/" + photoshotId + "/isLiked", fetcher);
  const {
    data: isSaved,
    mutate: updateSaved,
    isLoading: savedLoading,
    error: savedError,
  } = useSWR("/api/photoshot/" + photoshotId + "/isSaved", fetcher);
  const like = () => {
    return fetch("/api/photoshot/" + photoshotId + "/like", {
      method: "post",
    }).then(() => true);
  };
  const unlike = () => {
    return fetch("/api/photoshot/" + photoshotId + "/unlike", {
      method: "post",
    }).then(() => false);
  };
  const handleLike = async () => {
    console.log("liking");
    if (photoshot) {
      if (photoshot.is_liked) {
        await updateLiked(unlike(), {
          optimisticData: () => false,
          populateCache: () => false,
        });
        // updatePhotoshot({
        //   ...photoshot,
        //   likes_count: photoshot.likes_count - 1,
        // });
      } else {
        await updateLiked(like(), {
          optimisticData: () => true,
          populateCache: () => true,
        });
        // updatePhotoshot({
        //   ...photoshot,
        //   likes_count: photoshot.likes_count + 1,
        // });
      }
      //not working, need to be able to update like count properly, maybe don't store in a veiw?
      updatePhotoshot();
    }
  };

  const save = () => {
    return fetch("/api/photoshot/" + photoshotId + "/save", {
      method: "post",
    }).then(() => true);
  };
  const unsave = () => {
    return fetch("/api/photoshot/" + photoshotId + "/unsave", {
      method: "post",
    }).then(() => false);
  };
  const handleSave = () => {
    if (photoshot) {
      if (photoshot.is_saved) {
        updateSaved(unsave(), {
          optimisticData: () => false,
          populateCache: () => false,
        });
      } else {
        updateSaved(save(), {
          optimisticData: () => true,
          populateCache: () => true,
        });
      }
    }
  };
  return (
    <>
      {photoshot && (
        <Dialog
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
              {photoshot.photo_paths?.length > 0 ? (
                <img
                  className="object-cover rounded w-full aspect-square transition duration-300 ease-in-out"
                  src={photoshot.photo_paths[0]}
                  alt={photoshot.name ? photoshot.name : ""}
                />
              ) : (
                <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
              )}
              <div className="rounded z-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out absolute from-black/80 to-transparent bg-gradient-to-t inset-x-0 -bottom-2 pt-30 text-white flex justify-center w-full">
                <div>
                  <div className="transform-gpu  p-4 space-y-3 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 pb-10 transform transition duration-300 ease-in-out">
                    <div className="font-bold flex gap-4 flex-row items-center">
                      {photoshot.name}
                      <div className="flex flex-row items-center">
                        {photoshot.like_count ? <IoMdHeart /> : null}
                        <h1 className="text-sm font-semibold">
                          {photoshot.like_count > 0 ? photoshot.like_count : ""}
                        </h1>
                      </div>
                    </div>
                    {/* <RatingInput rating={photobookPicture.rating} /> */}
                  </div>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="p-10 lg:max-w[50dvw] md:max-w-[70dvw] sm:max-w-[90dvw]">
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
                    <div className="flex flex-row gap-4">
                      {photoshot.owner && (
                        <Button onClick={() => setEditMode(true)}>Edit</Button>
                      )}
                      <Button onClick={() => handleLike()}>
                        {isLiked ? <IoMdHeart /> : <IoMdHeartEmpty />}
                      </Button>
                      <Button onClick={() => handleSave()}>
                        {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                      </Button>
                    </div>
                  </div>
                  <h1 className="text-xl  text-left">
                    Created by: {photoshot.username}
                  </h1>
                  <DialogDescription className="pt-4">
                    <div className=" flex flex-auto gap-2">
                      {photoshot.tags &&
                        photoshot.tags.map((tag: Tag) => (
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
      )}
      {photoshotLoading && (
        <div>
          <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
        </div>
      )}
    </>
  );
}
