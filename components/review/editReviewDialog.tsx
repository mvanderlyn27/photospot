"use client"
import { PhotobookPicture, Photospot, Review } from "@/types/photospotTypes";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
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
import uploadPhotobookPicture from "@/app/serverActions/photobook/uploadPhotobookPicture";
import editPhotobookPicture from "@/app/serverActions/photobook/editPhotobookPicture";
import editReview from "@/app/serverActions/reviews/editReview";
import deleteReview from "@/app/serverActions/reviews/deleteReview";
import RatingDisplay from "./ratingDisplay";

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const editReviewSchema = z.object({
    //should add some better requirements for the location

    rating: z.string().optional(),
    text: z.string().optional(),
})


export default function EditReviewDialog({ review, setEditReviewDialogOpen, updateReviews }: { review: Review | null, setEditReviewDialogOpen: any, updateReviews: any }) {
    const [loading, setLoading] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const editReviewForm = useForm<z.infer<typeof editReviewSchema>>({
        resolver: zodResolver(editReviewSchema),
        defaultValues: {
            rating: review?.rating + "" || "3",
            text: review?.text || "",
        },
    })

    const onEdit = async (data: z.infer<typeof editReviewSchema>) => {
        if (review) {
            setLoading(true);
            await editReview(review.id, data);
            setLoading(false);
            await updateReviews();
            setEditReviewDialogOpen(false);
            toast({
                title: "Edits Saved! :)",
            })
        }
    }
    const promptDelete = (setting: boolean) => {
        setConfirmDelete(setting);
    }
    const handleDelete = async () => {
        if (review && confirmDelete) {
            setLoading(true);
            await deleteReview(review.id);
            setLoading(false);
            await updateReviews();
            setEditReviewDialogOpen(false);
            toast({
                title: "Review Deleted",
            });
        }
    }
    const resetForm = () => {
        //need to figure out how to properly clear the photos section
        editReviewForm.reset()
    }
    return (
        <div className="flex flex-col gap-2 ">
            <DialogTitle>Update your review</DialogTitle>
            <DialogDescription className="">Show off your artsy side, and help other users learn how to make better shots</DialogDescription>
            <Form {...editReviewForm}>
                <form onSubmit={editReviewForm.handleSubmit(onEdit)} className=" w-full flex flex-col">

                    <CardContent className={`flex-1 overflow-auto mb-4 }`}>
                        <FormField
                            control={editReviewForm.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    {field.value && <RatingDisplay rating={parseInt(field.value)} />}
                                    <Select value={"" + field.value} onValueChange={field.onChange} defaultValue={"" + field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select rating" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={"1"}>1</SelectItem>
                                            <SelectItem value={"2"}>2</SelectItem>
                                            <SelectItem value={"3"}>3</SelectItem>
                                            <SelectItem value={"4"}>4</SelectItem>
                                            <SelectItem value={"5"}>5</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        What would you rate this spot out of 10?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />

                        <FormField
                            control={editReviewForm.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>About this shot:</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Short description about how you got this awesome pic
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />

                    </CardContent>

                    <CardFooter className="flex-none flex-col gap-4">
                        <div className="w-full flex flex-row gap-8 justify-center">
                            <Button variant="outline" onClick={(e) => { e.preventDefault(); resetForm() }}>Reset</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                        <div className="w-full flex flex-row gap-8 justify-center">
                            {!confirmDelete && <Button variant="destructive" onClick={(e) => { e.preventDefault(); promptDelete(true) }}>Delete</Button>}
                            {confirmDelete && <Button variant="outline" onClick={(e) => { e.preventDefault(); promptDelete(false) }}>Cancel Delete</Button>}
                            {confirmDelete && <Button variant="destructive" onClick={(e) => { e.preventDefault(); handleDelete() }}>Confirm Delete</Button>}
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </div>
    )
}