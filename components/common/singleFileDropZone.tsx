"use client";

import {
    FileUploader,
    FileInput,
    FileUploaderContent,
    FileUploaderItem,
} from "@/components/ui/file-upload";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DropzoneOptions } from "react-dropzone";

const MAX_FILE_SIZE = 5242880; //5MB
//modifying so we can take in a string array of photos that exist already
const SingleFileUploadDropzone = ({ curPhoto, setPhoto }: { curPhoto?: File | null, setPhoto: any }) => {
    console.log("curPhotos", curPhoto);
    const [file, setFile] = useState<File | null>(curPhoto ? curPhoto : null);
    console.log('files', file);
    // useEffect(() => {
    //     setFile(curPhoto);
    // }, [curPhoto])
    const dropzone = {
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"],
        },
        multiple: false,
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE,
    } satisfies DropzoneOptions;
    const handleChange = (file: File[] | null) => {
        let val = null;
        if (file) {
            val = file[0];
        }
        setFile(val);
        setPhoto(val);
    }
    return (
        <FileUploader
            value={file ? [file] : []}
            onValueChange={handleChange}
            dropzoneOptions={dropzone}
        >
            <FileInput>
                <div className="flex items-center justify-center h-32 w-full border bg-background rounded-md">
                    <p className="text-gray-400">Drag photos in, or click to upload </p>
                </div>
            </FileInput>
            <FileUploaderContent className="grid grid-cols-3 gap-2">
                {file && <FileUploaderItem
                    index={0}
                    className="h-[100px] w-[100px] p-0 rounded-md overflow-hidden"
                    aria-roledescription={`file ${0 + 1} containing ${file.name}`}
                >
                    <Image
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        height={100}
                        width={100}
                        className="h-[100px] w-[100px] p-0 object-cover"
                    />
                </FileUploaderItem>
                }
            </FileUploaderContent>
        </FileUploader>
    );
};

export default SingleFileUploadDropzone;