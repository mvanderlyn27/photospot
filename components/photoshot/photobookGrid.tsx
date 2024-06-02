import { PhotobookPicture, Photospot, Review, ReviewGridInput } from '@/types/photospotTypes';
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import PhotobookPictureDialog from './photobookPictureDialog';
import PhotospotDialog from '../photospot/photospotDialog';
import { UserIdentity } from '@supabase/supabase-js';
import { useState } from 'react';
export default function PhotobookGrid({ input, photospot, user, updatePhotobook }: { input: PhotobookPicture[], photospot: Photospot | null, user: UserIdentity, updatePhotobook: any }) {
    const [photobookPictureDialogOpen, setPhotobookPictureDialogOpen] = useState(false);

    return (
        <div className=" w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4  grid-flow-row-dense" >
                {photospot &&
                    <Dialog>
                        <DialogTrigger>
                            <div key={photospot.id} className='overflow-hidden  aspect-square rounded relative group'>
                                {/* <Image key={review.name} placeholder='empty' className= "object-cover rounded w-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out "src={review.photo_paths[0]} layout="fill" objectFit='cover' alt={review.name ? review.name : ""}/> */}
                                <Image key={photospot.id} className="object-cover rounded w-full aspect-square transition duration-300 ease-in-out " src={photospot.photo_paths[0]} layout="fill" objectFit='cover' alt={photospot.name ? photospot.name : ""} />
                                <div className="rounded z-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out absolute from-black/80 to-transparent bg-gradient-to-t inset-x-0 -bottom-2 pt-30 text-white flex justify-center w-full">
                                    <div>
                                        <div className="transform-gpu  p-4 space-y-3 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 pb-10 transform transition duration-300 ease-in-out" >
                                            <div className="font-bold">{photospot.name}</div>
                                            {/* <RatingInput rating={review.rating} /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogTrigger>
                        <PhotospotDialog photospot={photospot} />
                    </Dialog>
                }
                {
                    input?.map(photobookPicture => {
                        return (
                            <Dialog open={photobookPictureDialogOpen} onOpenChange={setPhotobookPictureDialogOpen}>
                                <DialogTrigger>
                                    <div key={photobookPicture.name} className='overflow-hidden  aspect-square rounded relative group'>
                                        {/* <Image key={photobookPicture.name} placeholder='empty' className= "object-cover rounded w-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out "src={review.photo_paths[0]} layout="fill" objectFit='cover' alt={review.name ? review.name : ""}/> */}
                                        <Image key={photobookPicture.id} className="object-cover rounded w-full aspect-square transition duration-300 ease-in-out " src={photobookPicture.photo_paths[0]} layout="fill" objectFit='cover' alt={photobookPicture.name ? photobookPicture.name : ""} />
                                        <div className="rounded z-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out absolute from-black/80 to-transparent bg-gradient-to-t inset-x-0 -bottom-2 pt-30 text-white flex justify-center w-full">
                                            <div>
                                                <div className="transform-gpu  p-4 space-y-3 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 pb-10 transform transition duration-300 ease-in-out" >
                                                    <div className="font-bold">{photobookPicture.name} </div>
                                                    {/* <RatingInput rating={photobookPicture.rating} /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <PhotobookPictureDialog photobookPicture={photobookPicture} owner={user && user.id === photobookPicture.created_by} updatePhotobook={updatePhotobook} setPhotobookPictureDialogOpen={(val: boolean) => setPhotobookPictureDialogOpen(val)} />
                            </Dialog>
                        )
                    })
                }
            </div>
        </div >
    )
}