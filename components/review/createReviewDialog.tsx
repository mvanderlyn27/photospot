"use client";
import { Review } from "@/types/photospotTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import useSWR from "swr";
import CreateReviewForm from "./createReviewForm";
import { fetcher } from "@/utils/common/fetcher";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

export default function CreateReviewDialog({ id }: { id: number }) {
  const {
    data: photospot,
    isLoading,
    error,
  } = useSWR(`/api/photospot/${id}`, fetcher);
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useSWR("/api/photospot/" + id + "/reviews", fetcher);
  const user = useSWR("/api/profile", fetcher).data;
  const [loading, setLoading] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  console.log("user, loading reviews, reviews", user, reviewsLoading, reviews);
  //don't want to show up when there is a review you've done, if no reviews then we want to see
  return (
    <div className="flex flex-col gap-2 ">
      {reviews === undefined ||
        (user &&
          reviews &&
          !reviews.some((review: Review) => review.created_by === user.id) && (
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
              <DialogTrigger>
                {/* {!userReview && ( */}
                <div
                  className={
                    "text-2xl  " + cn(buttonVariants({ variant: "default" }))
                  }
                >
                  Review Photospot
                </div>
                {/* )} */}
              </DialogTrigger>
              <DialogContent>
                {photospot && (
                  <DialogTitle>
                    What do you think of {photospot.location_name}?
                  </DialogTitle>
                )}
                {isLoading && (
                  <DialogTitle>What do you think of ...</DialogTitle>
                )}
                <DialogDescription className="">
                  Help other users get a better idea of what it's like below
                </DialogDescription>
                {photospot && (
                  <CreateReviewForm
                    setReviewDialogOpen={setReviewDialogOpen}
                    photospot={photospot}
                  />
                )}
              </DialogContent>
            </Dialog>
          ))}
    </div>
  );
}
