"use client";
import { Review } from "@/types/photospotTypes";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import EditReviewForm from "./editReviewForm";

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const editReviewSchema = z.object({
  //should add some better requirements for the location

  rating: z.string().optional(),
  text: z.string().optional(),
});

export default function EditReviewDialog({
  review,
}: {
  review: Review | null;
}) {
  const [loading, setLoading] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const editReviewForm = useForm<z.infer<typeof editReviewSchema>>({
    resolver: zodResolver(editReviewSchema),
    defaultValues: {
      rating: review?.rating + "" || "3",
      text: review?.text || "",
    },
  });

  const resetForm = () => {
    //need to figure out how to properly clear the photos section
    editReviewForm.reset();
  };
  return (
    <div className="flex flex-col gap-2 ">
      {review && (
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogTrigger>
            <Button variant="outline" className="absolute top-4 right-4">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Update your review</DialogTitle>
            <DialogDescription className="">
              Let others know what you think of this spot
            </DialogDescription>
            <EditReviewForm
              reviewData={review}
              setReviewDialogOpen={setReviewDialogOpen}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
