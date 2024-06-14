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
const FileUploadDropzone = ({ curPhotos, setPhotos }: { curPhotos: File[], setPhotos: any }) => {
    console.log("curPhotos", curPhotos);
    const [files, setFiles] = useState<File[] | null>(null);
    console.log('files', files);
    useEffect(() => {
        setFiles(curPhotos);
    }, [curPhotos])
    const dropzone = {
        accept: {
            "image/*": [".jpg", ".jpeg", ".png"],
        },
        multiple: true,
        maxFiles: 6,
        maxSize: 6 * MAX_FILE_SIZE,
    } satisfies DropzoneOptions;
    const handleChange = (files: File[] | null) => {
        setFiles(files);
        setPhotos(files);
    }
    return (
        <FileUploader
            value={files}
            onValueChange={handleChange}
            dropzoneOptions={dropzone}
        >
            <FileInput>
                <div className="flex items-center justify-center h-32 w-full border bg-background rounded-md">
                    <p className="text-gray-400">Drag photos in, or click to upload </p>
                </div>
            </FileInput>
            <FileUploaderContent className="grid grid-cols-3 gap-2">
                {files?.map((file, i) => (
                    <FileUploaderItem
                        key={i}
                        index={i}
                        className="h-[100px] w-[100px] p-0 rounded-md overflow-hidden"
                        aria-roledescription={`file ${i + 1} containing ${file.name}`}
                    >
                        <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            height={100}
                            width={100}
                            className="h-[100px] w-[100px] p-0 object-cover"
                        />
                    </FileUploaderItem>
                ))}
            </FileUploaderContent>
        </FileUploader>
    );
};

export default FileUploadDropzone;