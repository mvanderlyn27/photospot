"use client";
import { Review } from "@/types/photospotTypes";
import { Card } from "../ui/card";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { DefaultProfile } from "@/utils/common/imageLinks";
import { Avatar, AvatarImage } from "../ui/avatar";
import RatingDisplay from "./ratingDisplay";
import { Button } from "../ui/button";
import { DialogContent, Dialog, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import EditReviewForm from "./editReviewForm";
import EditReviewDialog from "./editReviewDialog";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="w-fulll">
      <div className="relative p-4 flex flex-col gap-4">
        {review?.owner && <EditReviewDialog review={review} />}
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
  );
}
