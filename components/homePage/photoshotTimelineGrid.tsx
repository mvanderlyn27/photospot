import { Photoshot } from "@/types/photospotTypes";
import PhotoshotGridDialog from "./photoshotGridDialog";
import PhotoshotDialog from "../photoshot/photoshotDialog";

export default function PhotoshotTimelineGrid({ photoshots }: { photoshots: Photoshot[] }) {
    return (
        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-1 gap-4">
            {photoshots && photoshots.map(photoshot => <PhotoshotGridDialog photoshotId={photoshot.id} />)}
            {/* {photoshots && photoshots.map(photoshot => <PhotoshotDialog photoshotId={photoshot.id} />)} */}
        </div>
    )
}