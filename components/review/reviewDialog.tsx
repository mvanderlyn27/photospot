import { DialogContent } from "../ui/dialog";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Review, ReviewGridInput } from "@/types/photospotTypes";
import ImageCarousel from "../common/ImageCarousel";
import RatingInput from "./ratingInput";

export default function ReviewDialog({ review }: { review: Review }) {
    return (
        <DialogContent className="p-10 max-w-[50dvw]">
            <div className="flex flex-row">
                <ImageCarousel width={"600px"} height={"600px"} photos={review.photo_paths} />
                <div className="flex-col p-8 gap-8  w-full">
                    <div className="flex flex-row gap-4">
                        <h1 className="text-3xl font-semibold text-left">Rating: ({review.rating})</h1>
                        <RatingInput rating={review.rating} />
                    </div>
                    <h1 className="text-xl  text-left">Created by: {review.username}</h1>
                    <DialogDescription className="">
                        <h1>{review.text}</h1>
                    </DialogDescription>
                </div>
            </div>

        </DialogContent >
    )
}