import { Photoshot, Photospot, Profile, Review } from "@/types/photospotTypes";

export const isPhotospot = (input: any): input is Photospot => {
    if(input === null) return false;
    return "id" in input && "location_name" in input;
}
export const isPhotoshot = (input: any): input is Photoshot => {
    if(input === null) return false;
    return "id" in input && "name" in input;
}
export const isProfile = (input: any): input is Profile => {
    if(input === null) return false;
    return "id" in input && "username" in input && "bio" in input;
}
export const isReview = (input: any): input is Review => {
    if(input === null) return false;
    return "text" in input && "rating" in input && "owner" in input;
}