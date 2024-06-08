import { getPhotospotById, getPhotospotStatsById } from "@/app/supabaseQueries/photospot";
import { getTestImages } from "@/app/serverActions/storage/getTestImages";
import PhotospotGrid from "@/components/photospot/photospotGrid";
import PreviewMap from "@/components/maps/previewMap";
import PhotospotInfo from "@/components/photospot/photospotInfo";
import {
  Photoshot,
  Photospot,
  PhotospotStats,
  Review,
  ReviewGridInput,
} from "@/types/photospotTypes";
import ReviewGrid from "@/components/review/reviewGrid";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import CreateReviewDialog from "@/components/review/createReviewDialog";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/server";
import { getPhotospotReviews } from "@/app/serverActions/reviews/getPhotospotReviews";
import { getUser } from "@/app/serverActions/auth/getUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhotoshotGrid from "@/components/photoshot/photoshotGrid";
import { UserIdentity } from "@supabase/supabase-js";
import PhotoshotUploadDialog from "@/components/photoshot/photoshotUploadDialog";
import { getPhotoshotsByPhotospot } from "@/app/serverActions/photoshots/getPhotoshotsByPhotospot";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { getCurrentUser } from "@/app/supabaseQueries/user";
import { redirect } from "next/navigation";
import PhotospotReviewSection from "@/components/photospot/photospotReviewSection";
import { PhotospotPhotoSection } from "@/components/photospot/photospotPhotoSection";

export default async function PhotospotPage({ params }: { params: { id: string } }) {
  /*
        Want to be able to differentiate if user is the owner, and if user has made a review already
    */
  // const [photospotData, setPhotoSpotData] = useState<Photospot | null>(null);
  // const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // const [reviews, setReviews] = useState<Review[]>([]);
  // const [userReview, setUserReview] = useState<Review | null>(null);
  // const [stats, setStats] = useState<PhotospotStats | null>(null);
  // const [photoshots, setPhotoshots] = useState<Photoshot[]>([]);
  // // const [userPhotoshot, setUserPhotoshot] =
  //   useState<Photoshot | null>(null);
  // const [photobookPictureDialogOpen, setPhotobookPictureDialogOpen] =
  //   useState(false);
  // const supabase = createClient();

  // const updateReviews = async (id: number) => {
  //   getPhotospotReviews(id).then((reviews) => {
  //     console.log("reviews", reviews, "user", user);
  //     let userReviewIndex = -1;
  //     reviews.forEach((review, index) => {
  //       if (review.created_by === user?.id) {
  //         //     //check if user did a review already
  //         setUserReview(review);
  //         userReviewIndex = index;
  //         console.log("found users review", review, userReviewIndex);
  //       }
  //     });
  //     if (userReviewIndex === -1) {
  //       console.log("no reviews found");
  //       setUserReview(null);
  //       setReviews(reviews);
  //     } else if (userReviewIndex !== -1) {
  //       //if user review move to top
  //       reviews.sort(function (x, y) {
  //         return x === reviews[userReviewIndex]
  //           ? -1
  //           : y === reviews[userReviewIndex]
  //             ? 1
  //             : 0;
  //       });
  //       console.log("updated reviews", reviews);
  //       setReviews(reviews);
  //     }
  //   });
  // };

  // const updatePhotoshots = async (id: number) => {
  //   getPhotoshotsByPhotospot(id).then((photoshots) => {
  //     console.log("reviews", photoshots, "user", user);
  //     setPhotoshots(photoshots);
  //   });
  // };
  // const updatePhotospot = async (id: number) => {
  //   getPhotospotById(parseInt(params.id)).then((photospot: Photospot) => {
  //     console.log('photospot info', photospot)
  //     setPhotoSpotData(photospot);
  //   });
  // };
  // useEffect(() => {
  //   //pull info from photospot based on id
  //   updatePhotospot(parseInt(params.id));
  // }, [params.id]);
  // useEffect(() => {
  //   updateReviews(parseInt(params.id));
  //   updatePhotoshots(parseInt(params.id));
  // }, [photospotData, user]);
  // useEffect(() => {
  //   getUser().then((user) => {
  //     setUser(user);
  //   });
  //   getPhotospotByIdStats(parseInt(params.id)).then((stats) => {
  //     setStats(stats);
  //   });
  // }, []);
  // const { data: user, isLoading: userLoading, error: userError } = useQuery(getCurrentUser());


  return (
    <div className="flex flex-col justify-center gap-8 w-full pl-20 pr-20">
      <div className="flex flex-row gap-24 w-full justify-center h-[600px] ">
        <div className="flex-1 ">

          {user &&
            <PhotospotInfo
              user={user}
              id={parseInt(params.id)}
            />}
        </div>
        <div className="flex-1 ">
          <PreviewMap id={parseInt(params.id)} />
        </div>
      </div>
      <Tabs defaultValue="photos" className="w-full ">
        <TabsList className="w-full justify-center gap-24">
          <TabsTrigger value="photos" className="text-3xl">
            Photos
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-3xl">
            Reviews
          </TabsTrigger>
        </TabsList>
        <TabsContent value="photos" className="flex flex-col gap-4">
          <PhotospotPhotoSection id={parseInt(params.id)} />
          {/* <div className="flex flex-row items-right justify-between ">
            <div></div>
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
                <PhotoshotUploadDialog
                  selectedLocation={photospotData}
                  setPhotoshotDialogOpen={setPhotobookPictureDialogOpen}
                  updatePhotobook={() => updatePhotoshots(parseInt(params.id))}
                />
              </DialogContent>
            </Dialog>
          </div> */}
          {/* <PhotoshotGrid
            input={photoshots}
            user={user}
            updatePhotoshots={() => updatePhotoshots(parseInt(params.id))}
          /> */}
        </TabsContent>
        <TabsContent value="reviews">
          <PhotospotReviewSection id={parseInt(params.id)} />
          {/* <div className="flex flex-row justify-between ">
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
          /> */}
        </TabsContent>
      </Tabs>
    </div >
  );
}
