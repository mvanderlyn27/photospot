"use server"
import { Skeleton } from "../ui/skeleton";

export async function PhotospotPhotoSection({ id }: { id: number }) {
    return (
        <div>
            <Skeleton className="bg-balck/10 h-[600px] w-full" />
        </div>
    )
}