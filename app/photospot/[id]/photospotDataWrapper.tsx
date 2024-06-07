import { getPhotoshotTags } from "@/app/serverActions/photoshots/getPhotoshotTags";
import { getPhotoshotsByPhotospot } from "@/app/serverActions/photoshots/getPhotoshotsByPhotospot";
import { getPhotospotById } from "@/app/serverActions/photospots/getPhotospotById";
import { getPhotospotReviews } from "@/app/serverActions/reviews/getPhotospotReviews";
import { getForecast } from "@/app/serverActions/weather/getForecast";

export default async function PhotospotDataWrapper({ id }: { id: number }) {
    const photospot = await getPhotospotById(id);
    const reviews = await getPhotospotReviews(id);
    const tags = await getPhotoshotTags(id);
    const photoshots = await getPhotoshotsByPhotospot(id);
    const weather = await getForecast(photospot.lat, photospot.lng);
    return (
        <div>
        </div>
    )
}