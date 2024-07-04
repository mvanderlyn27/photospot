import { Photoshot, Photospot, Profile } from "@/types/photospotTypes";

export const isPhotospot = (input: any): input is Photospot => {
    return "id" in input && "location_name" in input;
}
export const isPhotoshot = (input: any): input is Photoshot => {
    return "id" in input && "photospot_id" in input;
}
export const isProfile = (input: any): input is Profile => {
    return "id" in input && "username" in input && "bio" in input;
}