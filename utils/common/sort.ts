import { Photoshot } from "@/types/photospotTypes";

export const sortByOwnershipAndDate = (a: Photoshot, b: Photoshot) => {
    if (a.owner && !b.owner) {
        return -1
    }
    if (!a.owner && b.owner) {
        return 1
    }
    else {
        if (a.created_at && b.created_at) {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            if (dateA < dateB) {
                return 1
            }
            else if (dateA > dateB) {
                return -1
            }
            else {
                return 0;
            }
        }
        else {
            return 0
        }
    }
}