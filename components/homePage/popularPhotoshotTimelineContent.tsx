import PhotoshotTimelineGrid from "./photoshotTimelineGrid";

export default function PopularPhotoshotTimelineContent() {
    return (
        <>
            <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photospot/popular?`} />
        </>
    )
}