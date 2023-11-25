import { PhotoGridInput } from '@/types/photospotTypes';
import Image from 'next/image'
import { Skeleton } from './ui/skeleton';
export default function PhotospotGrid( {photospots}: PhotoGridInput ) {
// export default function PhotospotGrid() {

//   const photospots = [
//     {
//       id: 1,
//       name: "test1",
//       description: "test1",
//       photo_paths: ["https://images.pexels.com/photos/18221115/pexels-photo-18221115/free-photo-of-young-woman-sitting-inside-a-train-in-black-and-white.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"], 
//       location: {latitude: 0, longitude: 0},
//       draft: false
//     },
//     {
//       id: 2,
//       name: "test2",
//       description: "test2",
//       photo_paths: ["https://images.pexels.com/photos/808147/pexels-photo-808147.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"], 
//       location: {latitude: 0, longitude: 0},
//       draft: false
//     },
//     {
//       id: 3,
//       name: "test3",
//       description: "test3",
//       photo_paths: ["https://images.pexels.com/photos/2338417/pexels-photo-2338417.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"], 
//       location: {latitude: 0, longitude: 0},
//       draft: false
//     },
//     {
//       id: 5,
//       name: "test5",
//       description: "test5",
//       photo_paths: ["https://images.pexels.com/photos/11568024/pexels-photo-11568024.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"], 
//       location: {latitude: 0, longitude: 0},
//       draft: false
//     },
//     {
//       id: 6,
//       name: "test6",
//       description: "test6",
//       photo_paths: ["https://images.pexels.com/photos/17791392/pexels-photo-17791392/free-photo-of-train-on-a-railway-station-in-black-and-white.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"], 
//       location: {latitude: 0, longitude: 0},
//       draft: false
//     },
//     {
//       id: 4,
//       name: "test4",
//       description: "test4",
//       photo_paths: ["https://images.pexels.com/photos/16446597/pexels-photo-16446597/free-photo-of-black-and-white-picture-of-a-young-woman-in-a-train.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"], 
//       location: {latitude: 0, longitude: 0},
//       draft: false
//     },
//     {
//       id: 7,
//       name: "test7",
//       description: "test7",
//       photo_paths: ["https://images.pexels.com/photos/3678455/pexels-photo-3678455.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"], 
//       location: {latitude: 0, longitude: 0},
//       draft: false
//     },
// ]
return (
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 grid-flow-row-dense" >
    { 
    photospots?.map(photospot => { return (
    <div key={photospot.name} className='overflow-hidden  aspect-square cursor-pointer rounded relative group'>
      {/* <Image key={photospot.name} placeholder='empty' className= "object-cover rounded w-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out "src={photospot.photo_paths[0]} layout="fill" objectFit='cover' alt={photospot.name ? photospot.name : ""}/> */}
      {
        photospot.photo_paths?.length > 0 ? 
      <Image key={photospot.name} className= "object-cover rounded w-full aspect-square group-hover:scale-110 transition duration-300 ease-in-out "src={photospot.photo_paths[0]} layout="fill" objectFit='cover' alt={photospot.name ? photospot.name : ""}/>
      : 
      <Skeleton key={photospot.name} className="object-cover rounded w-full aspect-square "/>
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
    )})
  }
  </div>
)  
}