"use client";
import { Photoshot, Photospot, Review } from "@/types/photospotTypes";
import { DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";
import EditPhotoshotForm from "./editPhotoshotForm";

export default function EditPhotoshotDialog({
  photoshot,
  setEditMode,
  setPhotoshotDialogOpen,
}: {
  photoshot: Photoshot;
  setEditMode: any;
  setPhotoshotDialogOpen: any;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-2 ">
      <DialogTitle>Update info for {photoshot?.name}</DialogTitle>
      <DialogDescription className="">
        Show off your artsy side, and help other users learn how to make better
        shots
      </DialogDescription>
      <EditPhotoshotForm photoshot={photoshot} setEditMode={setEditMode} setPhotoshotDialogOpen={setPhotoshotDialogOpen} />
    </div>
  );
}
