"user client"
import { DialogContent } from "../ui/dialog";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Photoshot, Review, ReviewGridInput } from "@/types/photospotTypes";
import ImageCarousel from "../common/ImageCarousel";
import { useState } from "react";
import UploadPhotobookPictureDialog from "./photoshotUploadDialog";
import EditPhotobookPictureDialog from "./editPhotoshotDialog";
import EditPhotoshotDialog from "./editPhotoshotDialog";

export default function PhotoshotDialog({ photoshot, owner, updatePhotoshots, setPhotoshotDialogOpen }: { photoshot: Photoshot, owner: boolean, updatePhotoshots: any, setPhotoshotDialogOpen: any }) {
    const [editMode, setEditMode] = useState(false);
    const saveEditChanges = () => {

    }
    return (
        <DialogContent className="p-10 max-w-[50dvw]">
            {!editMode && <div className="flex flex-row">
                <ImageCarousel width={"600px"} height={"600px"} photos={photoshot.photo_paths} />
                <div className="flex-col p-8 gap-8  w-full">
                    <div className="flex flex-row gap-4 justify-between">
                        <h1 className="text-3xl font-semibold text-left">{photoshot.name}</h1>
                        {owner && <Button onClick={() => setEditMode(true)}>Edit</Button>}
                    </div>
                    <h1 className="text-xl  text-left">Created by: {photoshot.username}</h1>
                    <DialogDescription className="pt-4">
                        <h1><b>How to take the shot: </b>{photoshot.recreate_text}</h1>
                    </DialogDescription>
                </div>
            </div>}
            {editMode && <EditPhotoshotDialog photoshot={photoshot} updatePhotoshots={updatePhotoshots} setPhotoshotDialogOpen={setPhotoshotDialogOpen} setEditMode={setEditMode} />}

        </DialogContent >
    )
}