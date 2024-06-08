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

export default function EditReviewForm({
  reviewData,
  setReviewDialogOpen,
}: {
  reviewData: Review;
  setReviewDialogOpen: any;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutate } = useSWRConfig();
  const createReviewForm = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      rating: reviewData.rating,
      text: reviewData.text ? reviewData.text : "",
    },
  });
  const editReview = async (
    data: z.infer<typeof createReviewSchema>
  ): Promise<Review> => {
    return fetch(
      "/api/photospot/" + reviewData.photospot_id + "/reviews/edit",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ).then((res: Response) => res.json());
  };
  const updateReview = (arr: Review[], old_val: Review, new_val: Review) => {
    const index = arr.indexOf(old_val);
    if (index !== -1) {
      arr[index] = new_val;
    }
    return arr;
  };
  const handleEdit = async (data: z.infer<typeof createReviewSchema>) => {
    //could pull user info here to have more seamless creation of new review
    const tempReview = {
      ...data,
      created_by: "",
      photospot_id: reviewData.photospot_id,
      created_at: "",
    } as Review;
    setSubmitting(true);
    await mutate(
      "/api/photospot/" + reviewData.photospot_id + "/reviews",
      editReview(data),
      {
        optimisticData: (current) =>
          updateReview(current, reviewData, tempReview),
        rollbackOnError: true,
      }
    );
    mutate("/api/photospot/" + reviewData.photospot_id + "/stats");
    clearForm();
    setSubmitting(false);
    toast({
      title: "Review Edited",
    });
    setReviewDialogOpen(false);
  };
  const clearForm = () => {
    //need to figure out how to properly clear the photos section
    createReviewForm.reset();
  };

  //delete functions
  const promptDelete = (setting: boolean) => {
    setConfirmDelete(setting);
  };
  const deleteReview = async () => {
    return fetch(
      "/api/photospot/" + reviewData.photospot_id + "/reviews/delete",
      {
        method: "POST",
      }
    ).then((res: Response) => res.json());
  };
  const removeReview = (arr: Review[], old_val: Review) => {
    const index = arr.indexOf(old_val);
    if (index !== -1) {
      arr.splice(index, 1);
    }
    return arr;
  };
  const handleDelete = async () => {
    setSubmitting(true);
    await mutate(
      "/api/photospot/" + reviewData.photospot_id + "/reviews",
      deleteReview(),
      {
        optimisticData: (current) => removeReview(current, reviewData),
        rollbackOnError: true,
      }
    );

    mutate("/api/photospot/" + reviewData.photospot_id + "/stats");
    setSubmitting(false);
    setReviewDialogOpen(false);
    toast({
      title: "Review Deleted",
    });
  };
  return (
    <Form {...createReviewForm}>
      <form
        onSubmit={createReviewForm.handleSubmit(handleEdit)}
        className=" w-full flex flex-col"
      >
        <CardContent className={`flex-1 overflow-auto mb-4 }`}>
          <FormField
            control={createReviewForm.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <RatingDisplay rating={field.value} />
                <Select
                  value={"" + field.value}
                  onValueChange={field.onChange}
                  defaultValue={"" + field.value}
                >
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
            )}
          />
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

        <CardFooter className="flex-none flex-col gap-4">
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
              Save
            </Button>
          </div>
          <div className="w-full flex flex-row gap-8 justify-center">
            {!confirmDelete && (
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  promptDelete(true);
                }}
              >
                Delete
              </Button>
            )}
            {confirmDelete && (
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  promptDelete(false);
                }}
              >
                Cancel Delete
              </Button>
            )}
            {confirmDelete && (
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
              >
                Confirm Delete
              </Button>
            )}
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}
