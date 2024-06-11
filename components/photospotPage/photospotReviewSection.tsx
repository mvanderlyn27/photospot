import CreateReviewDialog from "../review/createReviewDialog"
import ReviewGrid from "../review/reviewGrid"

export default function PhotospotReviewSection({ id }: { id: number }) {
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