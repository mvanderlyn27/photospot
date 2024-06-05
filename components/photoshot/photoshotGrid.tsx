import { Photoshot, Photospot, Review, ReviewGridInput } from '@/types/photospotTypes';
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import PhotobookPictureDialog from './photoshotDialog';
import PhotospotDialog from '../photospot/photospotDialog';
import { UserIdentity } from '@supabase/supabase-js';
import { useState } from 'react';
export default function PhotoshotGrid({ input, user, updatePhotoshots }: { input: Photoshot[], user: UserIdentity, updatePhotoshots: any }) {
    const [photoshotDialogOpen, setPhotoshotDialogOpen] = useState(false);

    return (
        <div className=" w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4  grid-flow-row-dense" >
                {
                    input?.map(photoshot => {
                        return (
                            <Dialog open={photoshotDialogOpen} onOpenChange={setPhotoshotDialogOpen}>
                                <DialogTrigger>
                                    <div key={photoshot.name} className='overflow-hidden  aspect-square rounded relative group'>
                                        {/* <Image key={photobookPicture.name} placeholder='empty' className= "object-cover rounded w-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out "src={review.photo_paths[0]} layout="fill" objectFit='cover' alt={review.name ? review.name : ""}/> */}
                                        <Image key={photoshot.id} className="object-cover rounded w-full aspect-square transition duration-300 ease-in-out " src={photoshot.photo_paths[0]} layout="fill" objectFit='cover' alt={photoshot.name ? photoshot.name : ""} />
                                        <div className="rounded z-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out absolute from-black/80 to-transparent bg-gradient-to-t inset-x-0 -bottom-2 pt-30 text-white flex justify-center w-full">
                                            <div>
                                                <div className="transform-gpu  p-4 space-y-3 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 pb-10 transform transition duration-300 ease-in-out" >
                                                    <div className="font-bold">{photoshot.name} </div>
                                                    {/* <RatingInput rating={photobookPicture.rating} /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <PhotobookPictureDialog photoshot={photoshot} owner={user && user.id === photoshot.created_by} updatePhotoshots={updatePhotoshots} setPhotoshotDialogOpen={(val: boolean) => setPhotoshotDialogOpen(val)} />
                            </Dialog>
                        )
                    })
                }
            </div>
        </div >
    )
}