import { Photospot } from "@/types/photospotTypes";

export const isPhotospot = (input: any): input is Photospot => {
    return "id" in input;
}