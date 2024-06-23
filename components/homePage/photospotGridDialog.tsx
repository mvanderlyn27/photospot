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
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import {
    Photoshot,
    Review,
    ReviewGridInput,
    Tag,
} from "@/types/photospotTypes";
import ImageCarousel from "../common/ImageCarousel";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
import Link from "next/link";
import TimelineCard from "./timelineDialogCard";
import TimelineDialogCard from "./timelineDialogCard";
import { motion } from 'framer-motion'

export default function PhotospotGridDialog({
    photospotId,
    photospotName,
    extraInfo,
}: {
    photospotId: number;
    photospotName: string;
    extraInfo?: string | undefined;
}) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { data: photoshot, isLoading: photoshotLoading } = useSWR("/api/photospot/" + photospotId + '/topPhotoshot', fetcher);
    // const {
    //     data: isLiked,
    //     mutate: updateLiked,
    //     isLoading: likedLoading,
    //     error: likedError,
    // } = useSWR("/api/photoshot/" + photoshotId + "/isLiked", fetcher);

    // const like = () => {
    //     return fetch("/api/photoshot/" + photoshotId + "/like", {
    //         method: "post",
    //     }).then(() => true);
    // };
    // const unlike = () => {
    //     return fetch("/api/photoshot/" + photoshotId + "/unlike", {
    //         method: "post",
    //     }).then(() => false);
    // };
    const handleLike = async () => {
        console.log("liking");
        // if (photoshot) {
        // if (isLiked) {
        //     await updateLiked(unlike(), {
        //         optimisticData: () => false,
        //         populateCache: () => false,
        //     });
        // updatePhotoshot({
        //   ...photoshot,
        //   likes_count: photoshot.likes_count - 1,
        // });
        // } else {
        //     await updateLiked(like(), {
        //         optimisticData: () => true,
        //         populateCache: () => true,
        // });
        // updatePhotoshot({
        //   ...photoshot,
        //   likes_count: photoshot.likes_count + 1,
        // });
        // }
        //not working, need to be able to update like count properly, maybe don't store in a veiw?
        // updatePhotoshot();
    }

    return (
        <>
            {photoshot && <Dialog
                key={photospotId}
                open={dialogOpen}
                onOpenChange={(open) => {
                    setDialogOpen(open);
                }}
            >
                <DialogTrigger asChild>
                    <div
                        key={photospotName}
                        className=" cursor-pointer group"
                    >
                        {/* <motion.div
                            className="w-[300px] h-[300px] rounded overflow-hidden"
                            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                        > */}

                        {!photoshotLoading ? (
                            <img
                                className="object-cover rounded w-full flex-1"
                                src={photoshot.photo_paths ? photoshot.photo_paths[0] : "/placeholder.png"}
                                alt={photospotName ? photospotName + '' : ""}
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = "/placeholder.png";
                                }}
                            />
                        ) : (
                            <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
                        )}

                        {/* </motion.div> */}
                        <div className="font-bold flex gap-4 flex-row items-center justify-between p-4">
                            <h1>
                                {photoshot ? photoshot.name : photospotName}
                            </h1>
                            {extraInfo && <h1>
                                {extraInfo}
                            </h1>
                            }
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent className="p-10 lg:max-w[50dvw] md:max-w-[70dvw] sm:max-w-[90dvw]">
                    {photoshot && <TimelineDialogCard photoshotId={photoshot.id} />}

                </DialogContent>
            </Dialog >
            }
        </>
    );
}

