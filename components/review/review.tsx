"use client"
import { Review } from "@/types/photospotTypes";
import { Card } from "../ui/card";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { DefaultProfile } from "@/utils/common/imageLinks";
import { Avatar, AvatarImage } from "../ui/avatar";
import RatingDisplay from "./ratingDisplay";
import { Button } from "../ui/button";
import { DialogContent, Dialog, DialogTrigger } from "../ui/dialog";
import EditReviewDialog from "./editReviewDialog";
import { useState } from "react";

export default function ReviewCard({ review, updateReviews }: { review: Review, updateReviews: any }) {
    const [editReviewDialogOpen, setEditReviewDialogOpen] = useState(false);
    return (
        <Card className="w-[40%]">
            <div className="relative p-4 flex flex-col gap-4">
                {review?.owner && <Dialog open={editReviewDialogOpen} onOpenChange={setEditReviewDialogOpen}>
                    <DialogTrigger>
                        <Button variant="outline" className="absolute top-4 right-4">Edit</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <EditReviewDialog review={review} setEditReviewDialogOpen={setEditReviewDialogOpen} updateReviews={updateReviews} />
                    </DialogContent>
                </Dialog>}
                <RatingDisplay rating={review.rating} />
                <p>{review.text}</p>
                <div className="flex flex-row gap-4 items-center">
                    <Avatar>
                        <AvatarImage src={DefaultProfile} />
                        <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                    <h1>{review.username}</h1>
                </div>

            </div>

        </Card>
    )
}