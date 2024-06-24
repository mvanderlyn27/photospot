"use client"
import { Photoshot } from "@/types/photospotTypes";
import TextSpinnerLoader from "../common/Loading";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { round } from "@/utils/common/math";
import { motion } from 'framer-motion';
import PhotoshotGridImage from "./photoshotGridImage";

export default function PhotoshotGrid({ photoshots, setSize, size, photoshotsLoading }: { photoshots: Photoshot[][], setSize: (num: number) => void, size: number, photoshotsLoading: boolean }) {
    const PAGE_COUNT = 20
    const containerRef = useRef(null)

    const [isInView, setIsInView] = useState(false)

    const isLoadingMore =
        photoshotsLoading || (size > 0 && photoshots && typeof photoshots[size - 1] === "undefined");
    const isEmpty = photoshots?.[0]?.length === 0;
    const isReachingEnd =
        photoshots[0].length == 0 || (photoshots && photoshots[photoshots.length - 1]?.length < PAGE_COUNT);
    // const isRefreshing = isValidating && data && data.length === size;
    const handleNewPhotoshot = () => {

    }
    const handleScroll = () => {
        if (containerRef.current && typeof window !== 'undefined') {
            const container: any = containerRef.current
            const { bottom } = container.getBoundingClientRect()
            const { innerHeight } = window
            setIsInView(() => bottom <= innerHeight)
        }
    }

    const handleDebouncedScroll = useDebouncedCallback(() => !isReachingEnd && handleScroll(), 200)
    useEffect(() => {
        window.addEventListener('scroll', handleDebouncedScroll)
        return () => {
            window.removeEventListener('scroll', handleDebouncedScroll)
        }
    }, [])

    useEffect(() => {
        if (isInView) {
            loadMoreTickets()
        }
    }, [isInView])
    useEffect(() => {
        if (isLoadingMore) {
            document.getElementById('loading')?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isLoadingMore]);

    const loadMoreTickets = () => {
        setSize(size + 1);
    }
    useEffect(() => {
        console.log('photoshots', photoshots);
    }, [photoshots])
    const getExtraInfo = (photoshot: Photoshot) => {
        if (photoshot.dist_meters) {
            return round(photoshot.dist_meters, 1) + ' meters';
        }
        else if (photoshot.like_count) {
            return photoshot.like_count + ' ❤';
        }
        else {
            //want to get shared tags/photospots for the suggested feed
            return undefined
        }
    }
    return (
        <>
            {photoshots &&

                <div className="w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8" ref={containerRef}>
                    {
                        photoshots.flat().map((photoshot, i) => {
                            const recalculatedDelay =
                                i >= PAGE_COUNT * 2 ? (i - PAGE_COUNT * (size - 1)) / 15 : i / 15

                            return (
                                <motion.div
                                    className="h-auto max-w-full"
                                    key={photoshot.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: [0.25, 0.25, 0, 1],
                                        // delay: recalculatedDelay,
                                        delay: .2
                                    }}
                                    whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                                >
                                    <PhotoshotGridImage photoshotId={photoshot.id} photoshotName={photoshot.name} photoshotPath={photoshot.photo_paths[0]} extraInfo={getExtraInfo(photoshot)} />
                                </motion.div>
                            )
                        })

                    }
                </div>
            }
            {isEmpty && <TimelineEmpty />}
            {isReachingEnd && <TimelineEnd />}
            {isLoadingMore && <TimelineLoading />}
        </>
    )
}

const TimelineLoading = () => {
    return (
        <div id="loading" className="flex flex-col items-center p-10">
            <TextSpinnerLoader text={"Loading Photos"} />
        </div>
    )
}
const TimelineEnd = () => {
    return (

        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold"> No more photos, check back soon!</h1>
        </div>
    )
}
const TimelineEmpty = () => {
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold"> No photos right now, check back soon!</h1>
        </div>
    )
}