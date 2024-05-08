import { Photospot } from "@/types/photospotTypes";
import PhotospotCard from "../timeline/photospotCard";

export default function PhotospotGrid({ photospots }: { photospots: Photospot[] }) {
    return (
        <div>
            {photospots && photospots.map((photospot) => (
                <div key={photospot.id} className="w-1/4 p-2">
                    {/* gonna replace with new component for images */}
                    <PhotospotCard photospot={photospot} />
                </div>
            ))}
        </div>
    )
}