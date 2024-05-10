import { Photospot } from '@/types/photospotTypes';
import Image from 'next/image'
import { Skeleton } from '../ui/skeleton';
export default function PhotospotGrid({ photospots }: { photospots: Photospot[] }) {
  // export default function PhotospotGrid() {


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 grid-flow-row-dense" >
      {
        photospots?.map(photospot => {
          return (
            <div key={photospot.name} className='overflow-hidden  aspect-square cursor-pointer rounded relative group'>
              {/* <Image key={photospot.name} placeholder='empty' className= "object-cover rounded w-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out "src={photospot.photo_paths[0]} layout="fill" objectFit='cover' alt={photospot.name ? photospot.name : ""}/> */}
              {
                photospot.photo_paths?.length > 0 ?
                  <Image key={photospot.name} className="object-cover rounded w-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out " src={photospot.photo_paths[0]} layout="fill" objectFit='cover' alt={photospot.name ? photospot.name : ""} />
                  :
                  <Skeleton key={photospot.name} className="object-cover rounded w-full aspect-square " />
              }
              <div className="rounded z-50 opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out cursor-pointer absolute from-black/80 to-transparent bg-gradient-to-t inset-x-0 -bottom-2 pt-30 text-white flex items-end">
                <div>
                  <div className="transform-gpu  p-4 space-y-3 text-xl group-hover:opacity-100 group-hover:translate-y-0 translate-y-4 pb-10 transform transition duration-300 ease-in-out" >
                    <div className="font-bold">{photospot.name}</div>
                    <div className="opacity-60 text-sm ">{photospot.description}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}