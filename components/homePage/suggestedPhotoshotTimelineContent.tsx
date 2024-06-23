import PhotoshotTimelineGrid from "./photoshotTimelineGrid";

export default function SuggestedPhotoshotTimelineContent() {
    return (
        <PhotoshotTimelineGrid initialPhotospots={[]} photoshotPath={`/api/photoshot/timeline/suggested?`} />
    )
}