import { Photoshot, Photospot, Review, ReviewGridInput } from '@/types/photospotTypes';
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton';
import { UserIdentity } from '@supabase/supabase-js';
import { useState } from 'react';
import { Dialog, DialogTrigger } from '../ui/dialog';
import PhotoshotDialog from './photoshotDialog';
export default function PhotoshotGrid({ input, user, updatePhotoshots }: { input: Photoshot[], user: UserIdentity, updatePhotoshots: any }) {
    return (
        <div className=" w-full flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4  grid-flow-row-dense" >
                {
                    input?.map(photoshot =>
                        <PhotoshotDialog photoshot={photoshot} owner={user?.id === photoshot.created_by} updatePhotoshots={updatePhotoshots} />
                    )}
            </div>
        </div >
    )
}