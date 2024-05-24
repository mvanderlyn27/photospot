"use client";
import { getPhotospotById } from "@/app/serverActions/photospots/getPhotospotById";
import { getTestImages } from "@/app/serverActions/storage/getTestImages";
import PhotospotGrid from "@/components/photospot/photospotGrid";
import PreviewMap from "@/components/maps/previewMap";
import PhotospotInfo from "@/components/photospot/photospotInfo";
import { Photospot, Review, ReviewGridInput } from "@/types/photospotTypes";
import { useEffect, useState } from "react";
import ReviewGrid from "@/components/review/reviewGrid";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import CreateReviewDialog from "@/components/review/createReviewDialog";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { getPhotospotReviews } from "@/app/serverActions/reviews/getPhotospotReviews";

export default function PhotospotPage({ params }: { params: { id: string } }) {
    const [photospotData, setPhotoSpotData] = useState<Photospot | null>(null);
    const [testPhotospots, setTestPhotospots] = useState<ReviewGridInput[]>([]);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [user, setUser] = useState<any>(null)
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const supabase = createClient()

    useEffect(() => {
        //pull info from photospot based on id
        getPhotospotById(parseInt(params.id)).then((photospot: Photospot) => {
            setPhotoSpotData(photospot);
        });

        supabase.auth.getUser().then(userData => {
            setUser(userData.data.user)
            getPhotospotReviews(parseInt(params.id)).then((reviews) => {
                console.log('reviews', reviews, 'user', user);
                // if (user.id in reviews) {
                //     //check if user did a review already
                // }
                setReviews(reviews);
            })
        });


    }, [params.id]);
    return (
        <div className="flex flex-col justify-center gap-8 w-full pl-20 pr-20">
            <div className="flex flex-row gap-24 w-full justify-center h-[500px] ">
                <div className="flex-1  h-50vh">
                    <PhotospotInfo photospot={photospotData} />
                </div>
                <div className="flex-1  h-50vh">
                    {photospotData?.lat && photospotData?.lng && <PreviewMap lat={photospotData.lat} lng={photospotData.lng} />}
                </div>
            </div>
            <div className="flex flex-row gap-24  w-full justify-center">
                <h1 className="text-2xl font-semibold ">User Impressions</h1>
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogTrigger>
                        <div className={"text-2xl  " + cn(buttonVariants({ variant: 'default' }))}>Add Yours</div>
                    </DialogTrigger>
                    <DialogContent>
                        <CreateReviewDialog photospot={photospotData} setReviewDialogOpen={setReviewDialogOpen} />
                    </DialogContent>
                </Dialog>
            </div>

            <ReviewGrid input={reviews} />
        </div>
    );
}
