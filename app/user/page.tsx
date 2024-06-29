import { redirect } from "next/navigation";

export default function ProfilePage({ params }: { params: { userId: string } }) {
    redirect('/profile/myPhotoshots')
    return (
        null
    )
}