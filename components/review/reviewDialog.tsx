import { DialogContent } from "../ui/dialog";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Review, ReviewGridInput } from "@/types/photospotTypes";
import ImageCarousel from "../common/ImageCarousel";

export default function ReviewDialog({ review }: { review: Review }) {
    return (
        <DialogContent className="p-10 max-w-[50dvw]">
            <div className="flex flex-row">
                <ImageCarousel width={"600px"} height={"600px"} photos={review.photo_paths} />
                <div className="flex-col p-8 w-full">
                    <h1 className="text-3xl font-semibold text-center">{review.text}</h1>
                    <DialogDescription className="m-8">
                        <h1>{review.text}</h1>
                    </DialogDescription>
                </div>
            </div>

        </DialogContent >
    )
}