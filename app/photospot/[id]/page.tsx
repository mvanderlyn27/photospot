"use client";
import { getPhotospotById, getPhotospotByIdStats } from "@/app/serverActions/photospots/getPhotospotById";
import { getTestImages } from "@/app/serverActions/storage/getTestImages";
import PhotospotGrid from "@/components/photospot/photospotGrid";
import PreviewMap from "@/components/maps/previewMap";
import PhotospotInfo from "@/components/photospot/photospotInfo";
import { Photospot, PhotospotStats, Review, ReviewGridInput } from "@/types/photospotTypes";
import { useEffect, useState } from "react";
import ReviewGrid from "@/components/review/reviewGrid";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import CreateReviewDialog from "@/components/review/createReviewDialog";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { getPhotospotReviews } from "@/app/serverActions/reviews/getPhotospotReviews";
import { getUser } from "@/app/serverActions/auth/getUser";

export default function PhotospotPage({ params }: { params: { id: string } }) {
    /*
        Want to be able to differentiate if user is the owner, and if user has made a review already
    */
    const [photospotData, setPhotoSpotData] = useState<Photospot | null>(null);
    const [testPhotospots, setTestPhotospots] = useState<ReviewGridInput[]>([]);
    const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
    const [owner, setOwner] = useState(false);
    const [user, setUser] = useState<any>(null)
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [stats, setStats] = useState<PhotospotStats | null>(null)
    const supabase = createClient()

    const updateReviews = async (id: number, userVal: any) => {
        getPhotospotReviews(id).then((reviews) => {
            console.log('reviews', reviews, 'user', userVal);
            if (userVal?.id === photospotData?.created_by) {
                setOwner(true);
            }
            reviews.forEach(review => {
                if (review.created_by === userVal?.id) {
                    //     //check if user did a review already
                    setUserReview(review);
                }
            });
            setReviews(reviews);
        });
    }

    useEffect(() => {
        //pull info from photospot based on id
        getPhotospotById(parseInt(params.id)).then((photospot: Photospot) => {
            setPhotoSpotData(photospot);
            setOwner(photospot?.created_by === user?.id);
        });

    }, [params.id]);
    useEffect(() => {
        updateReviews(parseInt(params.id), user);
    }, [photospotData, user])
    useEffect(() => {
        getUser().then(user => {
            setUser(user)
        });
        getPhotospotByIdStats(parseInt(params.id)).then((stats) => {
            setStats(stats)
        })
    }, [])

    return (
        <div className="flex flex-col justify-center gap-8 w-full pl-20 pr-20">
            <div className="flex flex-row gap-24 w-full justify-center h-[500px] ">
                <div className="flex-1  h-50vh">
                    <PhotospotInfo owner={owner} photospot={photospotData} stats={stats} />
                </div>
                <div className="flex-1  h-50vh">
                    {photospotData?.lat && photospotData?.lng && <PreviewMap lat={photospotData.lat} lng={photospotData.lng} />}
                </div>
            </div>
            <div className="flex flex-row gap-24  w-full justify-center">
                <h1 className="text-2xl font-semibold ">Photobook</h1>
                <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
                    <DialogTrigger>
                        <div className={"text-2xl  " + cn(buttonVariants({ variant: 'default' }))}>{userReview ? "Edit Yours" : "Add Yours"}</div>
                    </DialogTrigger>
                    <DialogContent>
                        <CreateReviewDialog photospot={photospotData} setReviewDialogOpen={setReviewDialogOpen} userReview={userReview} updateReviews={() => updateReviews(parseInt(params.id), user)} />
                    </DialogContent>
                </Dialog>
            </div>

            <ReviewGrid input={reviews} photospot={photospotData} />
        </div>
    );
}
