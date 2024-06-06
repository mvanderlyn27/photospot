import { Photospot } from "@/types/photospotTypes";
import { Button } from "../ui/button";

export default function PhotospotCard({ photospot }: { photospot: Photospot }) {

    return (
        <div>
            <div className="flex">
                <div className="w-1/2 lg:h-96">
                    <img className="w-full h-full rounded-md object-cover" alt="Image" src={photospot.top_photo_path ? photospot.top_photo_path : ""} />
                </div>
                <div className="w-1/2 pl-4 flex flex-col gap-4">
                    <div className="flex justify-between">
                        <h2 className="text-3xl font-bold">{photospot ? photospot.location_name : ""}</h2>
                        <div className="flex gap-4">
                            <Button variant="outline">Check Out</Button>
                            <Button variant="outline">Save</Button>
                        </div>
                    </div>

                    <p className="text-gray-600">{photospot ? photospot.rating : ""}</p>
                </div>
            </div>
        </div>
    )
}
//add rating info, tags/map later