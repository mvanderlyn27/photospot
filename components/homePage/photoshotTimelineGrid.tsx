"use client"
import { Photoshot } from "@/types/photospotTypes";
import PhotoshotGridDialog from "./photoshotGridDialog";
import PhotoshotDialog from "../photoshot/photoshotDialog";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { motion } from 'framer-motion'
import useSWRInfinite from "swr/infinite";
import { chunkify } from "@/utils/common/array";
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '@/tailwind.config.js'
import { useBreakpoint } from "@/hooks/tailwind";
import TextSpinnerLoader from "../common/Loading";
const fullConfig = resolveConfig(tailwindConfig)

export default function PhotoshotTimelineGrid({ initialPhotospots, photoshotPath }: { initialPhotospots: Photoshot[], photoshotPath: string }) {
    console.log('path', photoshotPath);

    const { isMd } = useBreakpoint('md');
    const { isLg } = useBreakpoint('lg');
    // const { data: photoshots, error, isLoading }: { data: Photoshot[], error: any, isLoading: boolean } = useSWR(photoshotPath ? photoshotPath : null, fetcher);
    const {
        data,
        mutate,
        size,
        setSize,
        isValidating,
        isLoading: photoshotsLoading
    } = useSWRInfinite(
        (index) =>
            `${photoshotPath}pageCount=${index + 1}`,
        fetcher
    );
    const PAGE_COUNT = 20
    const containerRef = useRef(null)
    const [offset, setOffset] = useState(1)
    const [isInView, setIsInView] = useState(false)
    const photoshots: Photoshot[] = data ? [].concat(...data) : [];
    const isLoadingMore =
        photoshotsLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.length < PAGE_COUNT);
    const isRefreshing = isValidating && data && data.length === size;
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

    return (
        <>
            {photoshots &&
                <div className="grid   sm:grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4" ref={containerRef}>
                    {
                        // chunkify(photoshots, isLg ? 5 : isMd ? 3 : 1, true).map((photoshotChunk, i) => {
                        // return (
                        // <div className="grid gap-4" >
                        // {photoshotChunk.map((photoshot, i) => {
                        photoshots.map((photoshot, i) => {
                            const recalculatedDelay =
                                i >= PAGE_COUNT * 2 ? (i - PAGE_COUNT * (offset - 1)) / 15 : i / 15

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
                                    <PhotoshotGridDialog photoshotId={photoshot.id} photoshotName={photoshot.name} photoshotPath={photoshot.photo_paths[0]} />
                                    {/* <Skeleton className="w-[300px] h-[300px] bg-black/10" /> */}
                                </motion.div>
                            )
                            // })}
                            // </div>
                            // )
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
        <div id="loading" className="flex flex-col items-center">
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