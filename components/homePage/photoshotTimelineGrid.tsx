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

export default function PhotoshotTimelineGrid({ initialPhotospots, photoshotPath }: { initialPhotospots: Photoshot[], photoshotPath: string }) {
    console.log('path', photoshotPath);
    // const { data: photoshots, error, isLoading }: { data: Photoshot[], error: any, isLoading: boolean } = useSWR(photoshotPath ? photoshotPath : null, fetcher);
    const PAGE_COUNT = 20
    const containerRef = useRef(null)
    const [loadedPhotoshots, setLoadedPhotoshots] = useState(initialPhotospots)
    const [offset, setOffset] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const [isLast, setIsLast] = useState(false)
    const handleScroll = () => {
        if (containerRef.current && typeof window !== 'undefined') {
            const container: any = containerRef.current
            const { bottom } = container.getBoundingClientRect()
            const { innerHeight } = window
            setIsInView((prev) => bottom <= innerHeight)
        }
    }

    useEffect(() => {
        const handleDebouncedScroll = useDebouncedCallback(() => !isLast && handleScroll(), 200)
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        if (isInView) {
            loadMoreTickets(offset)
        }
    }, [isInView])

    const loadMoreTickets = async (offset: number) => {
        setIsLoading(true)
        setOffset((prev) => prev + 1)
        const { data: newPhotoshots } = await fetchTickets(offset)
        if (newPhotoshots.length < PAGE_COUNT) {
            setIsLast(true)
        }
        setLoadedPhotoshots((prevPhotoshots) => [...prevPhotoshots, ...newPhotoshots])
        setIsLoading(false)
    }

    const fetchTickets = async (offset: number) => {
        const from = offset * PAGE_COUNT
        const to = from + PAGE_COUNT - 1

        // const { data } = await supabase!
        //     .from('my_tickets_table')
        //     .select('*')
        //     .range(from, to)
        //     .order('createdAt', { ascending: false })
        const data = await fetch(`${photoshotPath}from=${from}&to=${to}`).then((res) => res.json());

        return data
    }

    return (
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4" ref={containerRef}>
            {loadedPhotoshots && loadedPhotoshots.map((photoshot, i) => {
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
                        <PhotoshotGridDialog photoshotId={photoshot.id} />
                    </motion.div>
                )
            })
            }
            {/* {photoshots && photoshots.map(photoshot => <PhotoshotDialog photoshotId={photoshot.id} />)} */}
            {isLoading && Array(20).fill(0).map(() => <Skeleton className="w-full h-full bg-black/10" />)}
        </div>
    )
}