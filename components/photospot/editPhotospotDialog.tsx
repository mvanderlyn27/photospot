"use client"
import { Photospot, Review } from "@/types/photospotTypes";
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

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const createReviewSchema = z.object({
    //should add some better requirements for the location
    rating: z.coerce.number().min(1).max(5),
    text: z.string(),
    //tags for later
    photos: z.custom<FileList | null>((val) => val instanceof FileList, "Please upload a picture")
        .refine((files) => files ? files.length > 0 : false, `Required`)
        .refine((files) => files ? files.length <= 4 : true, `Maximum of 4 images are allowed.`)
        .refine(
            (files) =>
                files ? Array.from(files).every((file) => file.size <= MAX_FILE_SIZE) : true,
            `Each file size should be less than 5 MB.`
        )
        .refine(
            (files) =>
                files ? Array.from(files).every((file) =>
                    ACCEPTED_IMAGE_TYPES.includes(file.type)
                ) : true,
            "Only these types are allowed .jpg, .jpeg, .png and .webp"
        )
})


export default function EditPhotospotDialog({ photospot, setEditPhotospotDialogOpen }: { photospot: Photospot | null, setEditPhotospotDialogOpen: any, }) {
    const [loading, setLoading] = useState(false);
    const createReviewForm = useForm<z.infer<typeof createReviewSchema>>({
        resolver: zodResolver(createReviewSchema),
        defaultValues: {
            rating: 3,
            text: "",
            photos: null
        },
    })

    const onCreate = async (data: z.infer<typeof createReviewSchema>) => {
        if (photospot && data.photos) {
            let photos_form = new FormData();
            Array.from(data.photos).forEach((photo) => {
                photos_form.append(`review_pictures`, photo);
            })
            setLoading(true);
            await createReview(data, photospot.id, photos_form);
            setLoading(false);
            setEditPhotospotDialogOpen(false);
            toast({
                title: "Review Submitted",
            })
        }
    }

    const clearForm = () => {
        //need to figure out how to properly clear the photos section
        createReviewForm.reset()
    }
    return (
        <div className="flex flex-col gap-2 ">
            <DialogTitle>What do you think of {photospot?.name}?</DialogTitle>
            <DialogDescription className="">Help other users get a better idea of what it's like below</DialogDescription>
            <Form {...createReviewForm}>
                <form onSubmit={createReviewForm.handleSubmit(onCreate)} className=" w-full flex flex-col">

                    <CardContent className={`flex-1 overflow-auto mb-4 }`}>
                        <FormField
                            control={createReviewForm.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
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
                            control={createReviewForm.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comments</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Short description about why this location is cool
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        <FormField
                            control={createReviewForm.control}
                            name="photos"
                            render={({ field: { onChange }, ...field }) => (
                                <FormItem>
                                    <FormLabel>Photos</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="file" multiple={true} onChange={(e) => { onChange(e.target.files); }} />
                                    </FormControl>
                                    <FormDescription>
                                        Upload 1 or more cool photos from the spot
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>

                    <CardFooter className="flex-none">
                        <div className="w-full flex flex-row gap-8 justify-center">
                            <Button variant="outline" onClick={(e) => { e.preventDefault(); clearForm() }}>Reset</Button>
                            <Button type="submit">Update</Button>
                        </div>
                    </CardFooter>
                </form>
            </Form>
        </div>
    )
}