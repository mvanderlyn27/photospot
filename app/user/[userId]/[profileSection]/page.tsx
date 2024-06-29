import Followers from "@/components/profilePage/followers"
import Following from "@/components/profilePage/following"
import LikedPhotoshots from "@/components/profilePage/likedPhotoshots"
import MyPhotoshots from "@/components/profilePage/myPhotoshots"
import SavedPhotospots from "@/components/profilePage/savedPhotospots"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSection({ params }: { params: { profileSection: string } }) {

    return (
        <>
            {params.profileSection === 'followers' && <Followers />}
            {params.profileSection === 'following' && <Following />}
            {params.profileSection === 'savedPhotospots' && <SavedPhotospots />}
            {(params.profileSection === 'photoshots' || !params.profileSection) && <MyPhotoshots />}
            {(params.profileSection === 'likedPhotoshots') && <LikedPhotoshots />}
        </>
    )

}