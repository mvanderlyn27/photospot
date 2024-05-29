import { Photospot, Review, ReviewGridInput } from '@/types/photospotTypes';
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import PhotospotDialog from '../photospot/photospotDialog';
import ReviewCard from './review';
import { UserIdentity } from '@supabase/supabase-js';
export default function ReviewGrid({ input, user, updateReviews }: { input: Review[], user: UserIdentity | null, updateReviews: any }) {
    console.log('reviews', input);

    return (
        <div className=" w-full flex flex-col gap-4 items-center">
            {
                input && input?.map(review => {
                    return <ReviewCard review={review} owner={user?.id === review.created_by} updateReviews={updateReviews} />
                })}
        </div>
    )
}