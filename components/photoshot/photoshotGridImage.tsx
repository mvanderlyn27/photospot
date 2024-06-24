"use client";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import Image from "next/image";
export default function PhotoshotGridImage({ photoshotId, photoshotName, photoshotPath, extraInfo }: { photoshotId: number, photoshotName: string, photoshotPath: string, extraInfo?: string }) {
    return (
        <>
            <Link href={`/photoshot/${photoshotId}`}>
                {photoshotPath ? (
                    <div className=" sm:h-[500px] md:h-[400px] relative overflow-hidden">

                        <Image
                            src={photoshotPath}
                            alt={photoshotId ? photoshotId + '' : ""}
                            sizes="(max-width: 768px) 100vw ,(max-width: 1200px) 50vw, 33vw"
                            loading="eager"
                            fill={true}
                            className="object-cover rounded-lg"
                        />

                    </div>
                ) : (
                    <Skeleton className="bg-black/10 object-cover rounded w-full aspect-square " />
                )}

                <div className="font-bold flex gap-4 flex-row items-center justify-between p-4">
                    <h1>
                        {photoshotName}
                    </h1>
                    {extraInfo && <h1>
                        {extraInfo}
                    </h1>
                    }
                </div>

            </Link >
        </>
    );
}

