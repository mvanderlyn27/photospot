import Image from "next/image";
import { Photospot } from "@/types/photospotTypes";
import { DefaultPhotospot } from "@/utils/common/imageLinks";
import { AspectRatioIcon } from "@radix-ui/react-icons";
import { AspectRatio } from "../ui/aspect-ratio";

export default function PhotospotResult({
  photospot,
}: {
  photospot: Photospot;
}) {
  return (
    <div
      className="flex flex-row hover:bg-gray-100 cursor-pointer gap-4"
      onClick={() => {}}
    >
      <AspectRatio ratio={16 / 9}>
        <Image
          src={DefaultPhotospot}
          alt="Image"
          className="rounded-md object-cover"
          fill
        />
      </AspectRatio>
      <div className="w-3/4 flex flex-col justify-center">
        <h1 className="text-xl font-bold">{photospot.location_name}</h1>
        <p className="text-sm">{photospot.address}</p>
        <p className="text-sm">rating: {photospot.rating}</p>
        <p className="text-sm">dist meters: {photospot.dist_meters}</p>
        <p className="text-sm">created at: {photospot.created_at}</p>
      </div>
    </div>
  );
}
