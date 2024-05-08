import { Photospot } from "@/types/photospotTypes";

export default function PhotospotInfo({ photospot }: { photospot: Photospot | null }) {
    return (
        <div>
            {photospot?.name}
        </div>
    )
}