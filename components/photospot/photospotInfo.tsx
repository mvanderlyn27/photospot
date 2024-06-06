"use client"
import { Photospot, PhotospotStats } from "@/types/photospotTypes";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import GoldenHourDisplay from "./goldenHourDisplay";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { FaShareAlt } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaDirections } from "react-icons/fa";
import { savePhotospot } from "@/app/serverActions/photospots/savePhotospot";
import { getSavedPhotospot } from "@/app/serverActions/photospots/getSavedPhotospots";
import { unsavePhotospot } from "@/app/serverActions/photospots/unsavePhotospot";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { cn } from "@/lib/utils";
import SharePhotospotDialog from "./sharePhotospotDialog";
import EditPhotospotDialog from "./editPhotospotDialog";
import RatingDisplay from "../review/ratingDisplay";
import PhotoTimes from "./goldenHourDisplay";
import { Skeleton } from "../ui/skeleton";
import { getPhotospotsPhotoshotTags } from "@/app/serverActions/photospots/getPhotospotsPhotoshotTags";

export default function PhotospotInfo({
    photospot,
    stats,
    updatePhotospot,
}: {
    photospot: Photospot | null;
    stats: PhotospotStats | null;
    updatePhotospot: any
}) {
    const [saved, setSaved] = useState(false);
    const [editPhotospotDialogOpen, setEditPhotospotDialogOpen] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        //pull info from photospot based on id
        if (!photospot) return;

        getPhotospotsPhotoshotTags(photospot.id).then((tags) => {
            if (tags) {
                setTags(tags);
            }
        })
        getSavedPhotospot().then((photospots) => {
            let photospot_ids = photospots.map((photospot_obj) => photospot_obj.photospot);
            console.log('photospots saved: ', photospot_ids)
            setSaved(photospot_ids.includes(photospot?.id))
        })
    }, [photospot?.id])
    const handleSave = () => {
        if (!photospot) return
        if (saved) {
            unsavePhotospot(photospot.id);
            setSaved(false);
        }
        else {
            savePhotospot(photospot.id);
            setSaved(true);
        }

    }
    const handleShare = () => {
        //maybe add URL shortener lol

    }
    return (
        //setup skeelton for loading
        <>
            {photospot && stats ? <Skeleton className={`h-full w-full bg-slate-800/10 ${photospot ? "hidden" : ""}`} /> : null}
            < Card className={`h-full flex flex-col ${photospot ? "" : "hidden"}`}>
                <CardHeader className="flex-none">
                    <div className="flex flex-row justify-between">
                        <CardTitle className="text-3xl">
                            <div className="flex flex-row gap-4">
                                {photospot?.location_name}
                            </div>
                        </CardTitle>
                        <div className="flex flex-row gap-2">
                            <Dialog>
                                <DialogTrigger>
                                    <div className={cn(buttonVariants({ variant: 'default' }))}>
                                        <FaShareAlt className="w-6 h-6" />
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <SharePhotospotDialog />
                                </DialogContent>
                            </Dialog>
                            <Button onClick={() => handleSave()}>{saved ? <FaBookmark className="w-6 h-6" /> : <FaRegBookmark className="w-6 h-6" />}</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className=" flex flex-col gap-4 ">
                    <RatingDisplay rating={stats?.rating_average ? stats.rating_average : 0} count={stats?.rating_count ? stats.rating_count : 0} />
                    <div className=" flex flex-auto gap-2">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <PhotoTimes
                        lat={photospot?.lat}
                        lng={photospot?.lng}
                    />
                </CardContent>
            </Card>
        </>
    );
}
