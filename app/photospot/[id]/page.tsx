"use client";
import {
  getPhotospotById,
  getPhotospotByIdStats,
} from "@/app/serverActions/photospots/getPhotospotById";
import { getTestImages } from "@/app/serverActions/storage/getTestImages";
import PhotospotGrid from "@/components/photospot/photospotGrid";
import PreviewMap from "@/components/maps/previewMap";
import PhotospotInfo from "@/components/photospot/photospotInfo";
import {
  PhotobookPicture,
  Photospot,
  PhotospotStats,
  Review,
  ReviewGridInput,
} from "@/types/photospotTypes";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhotobookGrid from "@/components/photoshot/photobookGrid";
import { getPhotospotsPhotobookPictures } from "@/app/serverActions/photobook/getPhotospotsPhotobookPictures";
import UploadPhotobookPictureDialog from "@/components/photoshot/uploadPhotobookPictureDialog";
import { UserIdentity } from "@supabase/supabase-js";

export default function PhotospotPage({ params }: { params: { id: string } }) {
  /*
        Want to be able to differentiate if user is the owner, and if user has made a review already
    */
  const [photospotData, setPhotoSpotData] = useState<Photospot | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [owner, setOwner] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [stats, setStats] = useState<PhotospotStats | null>(null);
  const [photobookPictures, setPhotoBookPictures] = useState<
    PhotobookPicture[]
  >([]);
  const [userPhotobookPicture, setUserPhotobookPicture] =
    useState<PhotobookPicture | null>(null);
  const [photobookPictureDialogOpen, setPhotobookPictureDialogOpen] =
    useState(false);
  const supabase = createClient();

  const updateReviews = async (id: number) => {
    getPhotospotReviews(id).then((reviews) => {
      console.log("reviews", reviews, "user", user);
      if (user?.id === photospotData?.created_by) {
        setOwner(true);
      }
      let userReviewIndex = -1;
      reviews.forEach((review, index) => {
        if (review.created_by === user?.id) {
          //     //check if user did a review already
          setUserReview(review);
          userReviewIndex = index;
          console.log("found users review", review, userReviewIndex);
        }
      });
      if (userReviewIndex === -1) {
        console.log("no reviews found");
        setUserReview(null);
        setReviews(reviews);
      } else if (userReviewIndex !== -1) {
        //if user review move to top
        reviews.sort(function (x, y) {
          return x === reviews[userReviewIndex]
            ? -1
            : y === reviews[userReviewIndex]
            ? 1
            : 0;
        });
        console.log("updated reviews", reviews);
        setReviews(reviews);
      }
    });
  };

  const updatePhotobook = async (id: number) => {
    getPhotospotsPhotobookPictures(id).then((photoBookPictures) => {
      console.log("reviews", photoBookPictures, "user", user);
      if (user?.id === photospotData?.created_by) {
        setOwner(true);
      }
      photoBookPictures.forEach((photoBookPicture) => {
        if (photoBookPicture.created_by === user?.id) {
          //     //check if user did a photoBookPicture already
          // setUserphotoBookPicture(review);
        }
      });
      setPhotoBookPictures(photoBookPictures);
    });
  };
  const updatePhotospot = async (id: number) => {
    getPhotospotById(parseInt(params.id)).then((photospot: Photospot) => {
      setPhotoSpotData(photospot);
      setOwner(photospot?.created_by === user?.id);
    });
  };
  useEffect(() => {
    //pull info from photospot based on id
    updatePhotospot(parseInt(params.id));
  }, [params.id]);
  useEffect(() => {
    updateReviews(parseInt(params.id));
    updatePhotobook(parseInt(params.id));
  }, [photospotData, user]);
  useEffect(() => {
    getUser().then((user) => {
      setUser(user);
    });
    getPhotospotByIdStats(parseInt(params.id)).then((stats) => {
      setStats(stats);
    });
  }, []);

  return (
    <div className="flex flex-col justify-center gap-8 w-full pl-20 pr-20">
      <div className="flex flex-row gap-24 w-full justify-center h-[500px] ">
        <div className="flex-1  h-50vh">
          <PhotospotInfo
            owner={owner}
            photospot={photospotData}
            stats={stats}
            updatePhotospot={() => updatePhotospot(parseInt(params.id))}
          />
        </div>
        <div className="flex-1  h-50vh">
          {photospotData?.lat && photospotData?.lng && (
            <PreviewMap lat={photospotData.lat} lng={photospotData.lng} />
          )}
        </div>
      </div>
      <Tabs defaultValue="photos" className="w-full ">
        <TabsList className="w-full justify-center gap-8">
          <TabsTrigger value="photos" className="text-xl">
            Photobook
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-xl">
            Reviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="photos" className="flex flex-col gap-4">
          <div className="flex flex-row justify-between ">
            <h1 className="text-3xl font-semibold ">Inspo Photobook</h1>
            <Dialog
              open={photobookPictureDialogOpen}
              onOpenChange={setPhotobookPictureDialogOpen}
            >
              <DialogTrigger>
                <div
                  className={
                    "text-2xl  " + cn(buttonVariants({ variant: "default" }))
                  }
                >
                  Upload a shot
                </div>
              </DialogTrigger>
              <DialogContent>
                <UploadPhotobookPictureDialog
                  photospot={photospotData}
                  setPhotobookPictureDialogOpen={setPhotobookPictureDialogOpen}
                  updatePhotobook={() => updatePhotobook(parseInt(params.id))}
                />
              </DialogContent>
            </Dialog>
          </div>
          <PhotobookGrid
            photospot={photospotData}
            input={photobookPictures}
            user={user}
            updatePhotobook={() => updatePhotobook(parseInt(params.id))}
          />
        </TabsContent>
        <TabsContent value="reviews">
          <div className="flex flex-row justify-between ">
            <h1 className="text-3xl font-semibold ">Reviews</h1>
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
              <DialogTrigger>
                {!userReview && (
                  <div
                    className={
                      "text-2xl  " + cn(buttonVariants({ variant: "default" }))
                    }
                  >
                    Review Photospot
                  </div>
                )}
              </DialogTrigger>
              <DialogContent>
                <CreateReviewDialog
                  photospot={photospotData}
                  setReviewDialogOpen={setReviewDialogOpen}
                  userReview={userReview}
                  updateReviews={() => updateReviews(parseInt(params.id))}
                />
              </DialogContent>
            </Dialog>
          </div>
          <ReviewGrid
            input={reviews}
            user={user}
            updateReviews={() => updateReviews(parseInt(params.id))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
