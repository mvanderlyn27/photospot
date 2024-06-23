import { Tag } from "@/types/photospotTypes";
import { fetcher } from "@/utils/common/fetcher";
import { DialogDescription } from "@radix-ui/react-dialog";
import Link from "next/link";
import { Button } from "../ui/button";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import useSWR from "swr";
import ImageCarousel from "../common/ImageCarousel";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import TextSpinnerLoader from "../common/Loading";

export default function TimelineDialogCard({ photoshotId }: { photoshotId: number }) {
    const {
        data: photoshot,
        mutate: updatePhotoshot,
        isLoading: photoshotLoading,
        error: photoshotError,
    } = useSWR("/api/photoshot/" + photoshotId, fetcher);
    const {
        data: photospot,
        isLoading: photospotLoading,
        error: photospotError,
    } = useSWR("/api/photospot/" + photoshot?.photospot_id, fetcher);
    const {
        data: isLiked,
        mutate: updateLiked,
        isLoading: likedLoading,
        error: likedError,
    } = useSWR("/api/photoshot/" + photoshotId + "/isLiked", fetcher);
    const {
        data: isSaved,
        mutate: updateSaved,
        isLoading: savedLoading,
        error: savedError,
    } = useSWR("/api/photoshot/" + photoshotId + "/isSaved", fetcher);
    const like = () => {
        return fetch("/api/photoshot/" + photoshotId + "/like", {
            method: "post",
        }).then(() => true);
    };
    const unlike = () => {
        return fetch("/api/photoshot/" + photoshotId + "/unlike", {
            method: "post",
        }).then(() => false);
    };
    const handleLike = async () => {
        console.log("liking");
        if (photoshot) {
            if (photoshot.is_liked) {
                await updateLiked(unlike(), {
                    optimisticData: () => false,
                    populateCache: () => false,
                });
                // updatePhotoshot({
                //   ...photoshot,
                //   likes_count: photoshot.likes_count - 1,
                // });
            } else {
                await updateLiked(like(), {
                    optimisticData: () => true,
                    populateCache: () => true,
                });
                // updatePhotoshot({
                //   ...photoshot,
                //   likes_count: photoshot.likes_count + 1,
                // });
            }
            //not working, need to be able to update like count properly, maybe don't store in a veiw?
            updatePhotoshot();
        }
    };

    // const save = () => {
    //     return fetch("/api/photoshot/" + photoshotId + "/save", {
    //         method: "post",
    //     }).then(() => true);
    // };
    // const unsave = () => {
    //     return fetch("/api/photoshot/" + photoshotId + "/unsave", {
    //         method: "post",
    //     }).then(() => false);
    // };
    // const handleSave = () => {
    //     if (photoshot) {
    //         if (photoshot.is_saved) {
    //             updateSaved(unsave(), {
    //                 optimisticData: () => false,
    //                 populateCache: () => false,
    //             });
    //         } else {
    //             updateSaved(save(), {
    //                 optimisticData: () => true,
    //                 populateCache: () => true,
    //             });
    //         }
    //     }
    // };
    return (
        <>
            {photoshot && <div className="flex flex-row">
                <ImageCarousel
                    width={"600px"}
                    height={"600px"}
                    photos={photoshot.photo_paths}
                />
                <div className="flex-col p-8 gap-8  w-full">
                    <div className="flex flex-row gap-4 justify-between">
                        <h1 className="text-3xl font-semibold text-left">
                            {photoshot.name}
                        </h1>
                        <div className="flex flex-row gap-4 items-center">
                            <h1 className="font-semibold">{photoshot.like_count && photoshot.like_count == 1 ? "1 like" : photoshot.like_count + " likes"}</h1>
                            <Button onClick={() => handleLike()}>
                                {isLiked ? <IoMdHeart /> : <IoMdHeartEmpty />}
                            </Button>
                            {/* <Button onClick={() => handleSave()}>
                                {isSaved ? <FaBookmark /> : <FaRegBookmark />}
                            </Button> */}
                            <Link href={`/photospot/${photoshot.photospot_id}`}>
                                <Button>
                                    Visit
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <h1 className="text-xl  text-left">
                        Created by: {photoshot.username}
                    </h1>
                    {photospot &&
                        <h1 className="text-xl  text-left">
                            Taken at: <b>{photospot.location_name}</b>
                        </h1>
                    }
                    <DialogDescription className="pt-4">
                        <div className=" flex flex-auto gap-2">
                            {photoshot.tags &&
                                photoshot.tags.map((tag: Tag) => (
                                    <Badge key={tag.id} variant="outline">
                                        {tag.name}
                                    </Badge>
                                ))}
                        </div>
                        <h1>
                            <b>How to take the shot: </b>
                            {photoshot.recreate_text}
                        </h1>
                    </DialogDescription>
                </div>
            </div>}
            {photoshotLoading &&
                <div className="flex flex-row justify-center">
                    <TextSpinnerLoader text={"Loading Photo Shot"} />
                </div>
            }
        </>
    )
}