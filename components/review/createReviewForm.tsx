"use client";
import { Photospot, Review } from "@/types/photospotTypes";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import RatingDisplay from "./ratingDisplay";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/utils/common/fetcher";
import { RatingInput } from "./ratingInput";

const MAX_FILE_SIZE = 5242880; //5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const createReviewSchema = z.object({
  //should add some better requirements for the location
  rating: z.coerce.number().min(1).max(5),
  text: z.string(),
  //tags for later
});

export default function CreateReviewForm({
  photospot,
  setReviewDialogOpen,
}: {
  photospot: Photospot;
  setReviewDialogOpen: any;
}) {
  const [submitting, setSubmitting] = useState(false);
  const { mutate } = useSWRConfig();
  const createReviewForm = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: 3,
      text: "",
    },
  });
  const clearForm = () => {
    //need to figure out how to properly clear the photos section
    createReviewForm.reset();
  };
  const createNewReview = async (
    data: z.infer<typeof createReviewSchema>
  ): Promise<Review> => {
    return fetch("/api/photospot/" + photospot.id + "/reviews/create", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res: Response) => res.json());
  };
  const onCreate = async (data: z.infer<typeof createReviewSchema>) => {
    //could pull user info here to have more seamless creation of new review
    const tempReview = {
      ...data,
      created_by: "",
      photospot_id: photospot.id,
      created_at: "",
    } as Review;
    setSubmitting(true);
    await mutate(
      "/api/photospot/" + photospot.id + "/reviews",
      createNewReview(data),
      {
        optimisticData: (current, displayed) => [tempReview, ...current],
        rollbackOnError: true,
      }
    );
    mutate("/api/photospot/" + photospot.id + "/stats");
    clearForm();
    setSubmitting(false);
    toast({
      title: "Review Submitted",
    });
    setReviewDialogOpen(false);
  };
  const handleRating = (val: number) => {
    createReviewForm.setValue("rating", val);
  };
  return (
    <Form {...createReviewForm}>
      <form
        onSubmit={createReviewForm.handleSubmit(onCreate)}
        className=" w-full flex flex-col"
      >
        <CardContent className={`flex-1 overflow-auto mb-4 }`}>
          <RatingInput initialVal={3} onChange={handleRating} />
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
            )}
          />
        </CardContent>

        <CardFooter className="flex-none">
          <div className="w-full flex flex-row gap-8 justify-center">
            <Button
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                clearForm();
              }}
            >
              Reset
            </Button>
            <Button type="submit" disabled={submitting}>
              {" "}
              Create
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}
