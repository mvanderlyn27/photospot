"use client"
import { Photospot, Review } from "@/types/photospotTypes";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import createReview from "@/app/serverActions/reviews/createReview";
import RatingDisplay from "./ratingDisplay";
import { cn } from "@/lib/utils";
import useSWR, { useSWRConfig } from "swr";
import CreateReviewForm from "./createReviewForm";
import { fetcher } from "@/utils/common/fetcher";
import PhotoshotUploadDialog from "../photoshot/photoshotUploadDialog";
import { User } from "@supabase/supabase-js";


export default function CreateReviewDialog({ id }: { id: number }) {
    const { data: photospot, isLoading, error } = useSWR(`/api/photospot/${id}`, fetcher);
    const { data: reviews, error: reviewsError } = useSWR(`/api/photospot/${id}/reviews/`, fetcher);
    const user: User = useSWR('/api/user', fetcher).data;
    const [loading, setLoading] = useState(false);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const { mutate } = useSWRConfig();




    return (
        <div className="flex flex-col gap-2 ">
            {reviews && user && !reviews.some((review: Review) => (review.created_by === user.id)) && <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
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
                    {photospot && <DialogTitle>What do you think of {photospot.location_name}?</DialogTitle>}
                    {isLoading && <DialogTitle>What do you think of ...</DialogTitle>}
                    <DialogDescription className="">Help other users get a better idea of what it's like below</DialogDescription>
                    {photospot && <CreateReviewForm setReviewDialogOpen={setReviewDialogOpen} photospot={photospot} />}
                </DialogContent>
            </Dialog>}
        </div>
    )
}