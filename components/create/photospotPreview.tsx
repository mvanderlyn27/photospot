"use client"
import { Photospot } from "@/types/photospotTypes";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { round } from "@/utils/common/math";
import { Button } from "../ui/button";
import { redirect, useRouter } from "next/navigation";
import ImageCarousel from "../common/ImageCarousel";

export default function PhotospotPreview({ photospot, setViewingPhotospot }: { photospot: Photospot, setViewingPhotospot: any }) {
    const router = useRouter();
    const handleVisitPhotospot = () => {
        console.log('visiting photospot', photospot);
        router.push('/photospot/' + photospot.id);
    }
    return (
        <>
            <CardHeader className="flex-none">
                <CardTitle className="text-3xl">{photospot.name}</CardTitle>
                <CardDescription>
                    For more info (golden hour time, reviews etc), click visit</CardDescription>
            </CardHeader>

            <CardContent className={`flex flex-col flex-1 justify-center`}>
                <div className=" flex w-full content-center justify-center">
                    <ImageCarousel photos={photospot.photo_paths} />
                </div>
            </CardContent>
            <CardContent className={`flex flex-col flex-1 justify-left`}>
                <h4 className="text-xl font-semibold">
                    Description:
                </h4>
                <p className="leading-7 max-">
                    {photospot.description}
                </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setViewingPhotospot(false)}>Back</Button>
                <Button onClick={() => handleVisitPhotospot()}>Visit</Button>
            </CardFooter>
        </>

    )
}