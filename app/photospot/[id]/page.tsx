"use client"
import { getById } from "@/app/serverActions/photospots/getById"
import PhotospotGrid from "@/components/PhotoSpotGrid"
import PreviewMap from "@/components/maps/previewMap"
import PhotospotInfo from "@/components/photospot/photospotInfo"
import { Photospot } from "@/types/photospotTypes"
import { useEffect, useState } from "react"

export default function PhotospotPage({ params }: { params: { id: string } }) {
    const [photospotData, setPhotoSpotData] = useState<Photospot | null>(null)
    useEffect(() => {
        //pull info from photospot based on id 
        getById(parseInt(params.id)).then((photospot: Photospot) => {
            setPhotoSpotData(photospot)
        })
    }, [params.id])
    return (
        <div className="flex flex-col w-full justify-center gap-8">
            <div className="flex flex-row w-full gap-8">
                <div className="flex-1">
                    <PhotospotInfo photospot={photospotData} />
                </div>
                <div className="flex-1">
                    <PreviewMap />
                </div>

            </div>
            <PhotospotGrid photospots={[]} />
        </div>
    )
}
