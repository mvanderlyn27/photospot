import Followers from "@/components/profilePage/followers"
import Following from "@/components/profilePage/following"
import LikedPhotoshots from "@/components/profilePage/likedPhotoshots"
import MyPhotoshots from "@/components/profilePage/myPhotoshots"
import MySettings from "@/components/profilePage/mySettings"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileSection({ params }: { params: { profileSection: string } }) {

    return (
        <>
            {params.profileSection === 'followers' && <Followers />}
            {params.profileSection === 'following' && <Following />}
            {(params.profileSection === 'likedPhotoshots' || !params.profileSection) && <LikedPhotoshots />}
            {params.profileSection === 'myPhotoshots' && <MyPhotoshots />}
            {params.profileSection === 'mySettings' && <MySettings />}
        </>
    )

}