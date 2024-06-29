import { redirect } from "next/navigation";

export default function ProfilePage({ params }: { params: { userId: string } }) {
    redirect('/profile/user/' + params.userId + '/photoshots')
    return (
        null
    )
}