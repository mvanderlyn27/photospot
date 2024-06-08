"use server"

import CreateReviewDialog from "../review/createReviewDialog"
import ReviewGrid from "../review/reviewGrid"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import { Skeleton } from "../ui/skeleton"

export default async function PhotospotReviewSection({ id }: { id: number }) {
    return (
        <div>
            <div className="flex flex-row justify-between ">
                <h1 className="text-3xl font-semibold ">Reviews</h1>
                {/*button for making review/mutating review route */}
                <CreateReviewDialog id={id} />
            </div>
            <ReviewGrid id={id} />
        </div>
    )
}