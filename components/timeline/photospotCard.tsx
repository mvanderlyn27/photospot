"use client"
import { Photospot } from "@/types/photospotTypes";
import { Button } from "../ui/button";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

export default function PhotospotCard({ photospot }: { photospot: Photospot }) {
    const { data: topPhotospot, isLoading, error } = useSWR('/api/photospot/' + photospot.id + '/topPhotoshot', fetcher);
    return (
        <div>
            <div className="flex">
                <div className="w-1/2 lg:h-96">
                    {topPhotospot && <img className="w-full h-full rounded-md object-cover" alt="Image" src={topPhotospot.photo_paths[0]} />}
                    {isLoading && <Skeleton className="w-full h-full rounded-md object-cover bg-black/10" />}
                </div>
                <div className="w-1/2 pl-4 flex flex-col gap-4">
                    <div className="flex justify-between">
                        <h2 className="text-3xl font-bold">{photospot ? photospot.location_name : ""}</h2>
                        <div className="flex gap-4">
                            <Link href={'/photospot/' + photospot.id}>
                                <Button variant="outline">Check Out</Button>
                            </Link>
                            {/* <Button variant="outline">Save</Button> */}
                        </div>
                    </div>

                    <p className="text-gray-600">{photospot ? photospot.rating : ""}</p>
                </div>
            </div>
        </div>
    )
}
//add rating info, tags/map later