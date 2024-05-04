"use client"
import { useEffect, useState } from "react";

export default function PhotoUploadGrid({ photos }: { photos: FileList | null | undefined }) {
    // console.log('photos', photos)
    const [photoSrc, setPhotoSrc] = useState([] as string[]);
    useEffect(() => {
        if (photos) {
            const imageSrcs = Array.from(photos).map((file) => {
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result as string);
                    };
                    reader.onerror = () => {
                        reject(new Error('Failed to read file'));
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(imageSrcs).then((srcs) => {
                // Use the array of image srcs
                setPhotoSrc(srcs);
                // console.log(srcs);
            });
        }
        else {
            setPhotoSrc([]);
        }
    })

    return (
        <div className="grid grid-cols-2 gap-4">
            {photoSrc.map((src, index) => (
                <img key={index} src={src} alt="Photo" className="w-full h-full object-cover" />
            ))}
        </div>
    )
}