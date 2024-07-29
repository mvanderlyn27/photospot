"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import EditPhotospotForm from "./editPhotospotForm";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

export default function EditPhotospotDialog({
  photospotName,
  setPhotospotName,
}: {
  photospotName: string;
  setPhotospotName: any;
}) {
  const [editPhotospotsDialogOpen, setEditPhotospotsDialogOpen] =
    useState(false);
  return (
    <Dialog
      open={editPhotospotsDialogOpen}
      onOpenChange={setEditPhotospotsDialogOpen}
    >
      <DialogTrigger>
        <Button onClick={() => setEditPhotospotsDialogOpen(true)}>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <h1 className="text-2xl">Know a better name?</h1>
        </DialogTitle>
        <EditPhotospotForm
          photospotName={photospotName}
          setPhotospotName={setPhotospotName}
        />
      </DialogContent>
    </Dialog>
  );
}
