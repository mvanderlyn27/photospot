import { Review, ReviewGridInput } from '@/types/photospotTypes';
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import ReviewDialog from './reviewDialog';
import RatingInput from './ratingInput';
export default function ReviewGrid({ input }: { input: Review[] }) {


    return (
        <div className=" w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4  grid-flow-row-dense" >
                {
                    input?.map(review => {
                        return (
                            <Dialog>
                                <DialogTrigger>
                                    <div key={review.text} className='overflow-hidden  aspect-square rounded relative group'>
                                        {/* <Image key={review.name} placeholder='empty' className= "object-cover rounded w-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out "src={review.photo_paths[0]} layout="fill" objectFit='cover' alt={review.name ? review.name : ""}/> */}
                                        <Image key={review.id} className="object-cover rounded w-full aspect-square transition duration-300 ease-in-out " src={review.photo_paths[0]} layout="fill" objectFit='cover' alt={review.text ? review.text : ""} />
                                        <div className="rounded z-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out absolute from-black/80 to-transparent bg-gradient-to-t inset-x-0 -bottom-2 pt-30 text-white flex justify-center w-full">
                                            <div>
                                                <div className="transform-gpu  p-4 space-y-3 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 pb-10 transform transition duration-300 ease-in-out" >
                                                    <div className="font-bold">{review.username}</div>
                                                    {/* <RatingInput rating={review.rating} /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <ReviewDialog review={review} />
                            </Dialog>
                        )
                    })
                }
            </div>
        </div >
    )
}