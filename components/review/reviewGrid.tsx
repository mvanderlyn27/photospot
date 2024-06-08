"use client";
import { Review } from "@/types/photospotTypes";
import { Skeleton } from "../ui/skeleton";
import ReviewCard from "./review";
import { fetcher } from "@/utils/common/fetcher";
import useSWR from "swr";
export default function ReviewGrid({ id }: { id: number }) {
  const {
    data: reviews,
    isLoading: reviewsLoading,
    error: reviewsError,
    mutate: updateReviews,
  } = useSWR("/api/photospot/" + id + "/reviews", fetcher);
  console.log("reviews in grid", reviews);
  return (
    <div className=" w-full flex flex-col gap-4 items-center">
      {reviews &&
        reviews?.map((review: Review) => {
          return <ReviewCard review={review} updateReviews={updateReviews} />;
        })}
      {reviewsLoading && (
        <Skeleton className="h-20 w-[400px] bg-slate-800/10" />
      )}
    </div>
  );
}
