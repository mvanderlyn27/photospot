import { PhotoTime, Photospot } from "@/types/photospotTypes";
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
import { Button } from "../ui/button";
import { FaShareAlt } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { savePhotospot } from "@/app/serverActions/photospots/savePhotospot";
import { getSavedPhotospot } from "@/app/serverActions/photospots/getSavedPhotospots";
import { unsavePhotospot } from "@/app/serverActions/photospots/unsavePhotospot";
import { getPhotospotTags } from "@/app/serverActions/photospots/getPhotospotTags";

export default function PhotospotInfo({
    photospot,
}: {
    photospot: Photospot | null;
}) {
    const [saved, setSaved] = useState(false);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        //pull info from photospot based on id
        if (!photospot) return;

        getPhotospotTags(photospot.id).then((tags) => {
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
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-none">
                <div className="flex flex-row justify-between">
                    <CardTitle className="text-3xl">{photospot?.name}</CardTitle>
                    <div className="flex flex-row gap-2">
                        {/* <Button className="p-2"><FaEdit className="w-6 h-6" /></Button> */}
                        <Button><FaShareAlt className="w-6 h-6" /></Button>
                        <Button onClick={() => handleSave()}>{saved ? <FaBookmark className="w-6 h-6" /> : <FaRegBookmark className="w-6 h-6" />}</Button>
                    </div>
                </div>
                <CardDescription>Rating: 3.5/5</CardDescription>
                <div className=" flex flex-auto gap-2">
                    {tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                            {tag}
                        </Badge>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4 justify-between">
                <div className="">
                    <h2>
                        <b>A bit more about this spot:</b> {photospot?.description}
                    </h2>
                </div>
                <div className="">
                    <GoldenHourDisplay

                        lat={photospot?.lat}
                        lng={photospot?.lng}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
