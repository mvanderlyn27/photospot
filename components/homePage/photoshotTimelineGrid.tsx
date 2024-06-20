import { Photoshot } from "@/types/photospotTypes";
import PhotoshotGridDialog from "./photoshotGridDialog";
import PhotoshotDialog from "../photoshot/photoshotDialog";
import useSWR from "swr";
import { fetcher } from "@/utils/common/fetcher";
import { Skeleton } from "../ui/skeleton";

export default function PhotoshotTimelineGrid({ photoshotPath }: { photoshotPath: string }) {
    console.log('path', photoshotPath);
    const { data: photoshots, error, isLoading }: { data: Photoshot[], error: any, isLoading: boolean } = useSWR(photoshotPath ? photoshotPath : null, fetcher);
    return (
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4">
            {photoshots && photoshots.map(photoshot => <PhotoshotGridDialog photoshotId={photoshot.id} />)}
            {/* {photoshots && photoshots.map(photoshot => <PhotoshotDialog photoshotId={photoshot.id} />)} */}
            {isLoading && Array(20).fill(0).map(() => <Skeleton className="w-full h-full bg-black/10" />)}
        </div>
    )
}