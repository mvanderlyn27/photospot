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

export default function PhotoshotTimelineGrid({ initialPhotospots, photoshotPath }: { initialPhotospots: Photoshot[], photoshotPath: string }) {
    console.log('path', photoshotPath);
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
    const [loadedPhotoshots, setLoadedPhotoshots] = useState(initialPhotospots)
    const [offset, setOffset] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const [isLast, setIsLast] = useState(false)
    const photoshots: Photoshot[] = data ? [].concat(...data) : [];
    const isLoadingMore =
        isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.length < PAGE_COUNT);
    const isRefreshing = isValidating && data && data.length === size;
    const handleScroll = () => {
        if (containerRef.current && typeof window !== 'undefined') {
            const container: any = containerRef.current
            const { bottom } = container.getBoundingClientRect()
            const { innerHeight } = window
            setIsInView(() => bottom <= innerHeight)
        }
    }

    const handleDebouncedScroll = useDebouncedCallback(() => !isLast && handleScroll(), 200)
    useEffect(() => {
        window.addEventListener('scroll', handleDebouncedScroll)
        return () => {
            window.removeEventListener('scroll', handleDebouncedScroll)
        }
    }, [])

    useEffect(() => {
        if (isInView) {
            loadMoreTickets(offset)
        }
    }, [isInView])

    const loadMoreTickets = async (offset: number) => {
        setSize(size + 1);
    }
    useEffect(() => {
        console.log('photoshots', photoshots);
    }, [photoshots])

    return (
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4" ref={containerRef}>
            {photoshots && photoshots.map((photoshot, i) => {
                const recalculatedDelay =
                    i >= PAGE_COUNT * 2 ? (i - PAGE_COUNT * (offset - 1)) / 15 : i / 15

                return (
                    <motion.div
                        key={photoshot.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.25, 0.25, 0, 1],
                            delay: recalculatedDelay,
                        }}
                    >
                        <PhotoshotGridDialog photoshotId={photoshot.id} photoshotName={photoshot.name} photoshotPath={photoshot.photo_paths[0]} />
                        {/* <Skeleton className="w-[300px] h-[300px] bg-black/10" /> */}
                    </motion.div>
                )
            })
            }
            {/* {photoshots && photoshots.map(photoshot => <PhotoshotDialog photoshotId={photoshot.id} />)} */}
            {photoshotsLoading && Array(20).fill(0).map(() => <Skeleton className="w-full h-full bg-black/10" />)}
        </div>
    )
}