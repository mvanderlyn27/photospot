export type Photolist = {
    created_at?: string;
    created_by?: string | null;
    description?: string | null;
    id: number;
    name: string;
    photospots?: number[];
}
export type PhotolistInput = {
    created_at?: string; 
    created_by?: string;
    description?: string;
    name: string;
}

export type PhotospotInput = {
    description?: string;
    name?: string;
    location?: string;
    draft?: boolean;
    photo_paths?: string[];
}

export type Photospot  = {
    created_at?: string;
    created_by?: string;
    description?: string;
    id: number;
    name: string;
    photo_paths: string[];
    location: string;
    draft?: boolean;
    photo_placeholder?: "blur" | "empty" | `data:image/${string}` | undefined;
}

export type PhotospotInsert  = {
    description?: string;
    name: string;
    photo_paths: string[];
    location: string;
    draft?: boolean;
}

export type PhotoGridInput = {
    photospots: Photospot[] | undefined
}

export type PublicProfile = {
    id: number;
    username: string;
    private?: boolean;
    role?: string;
    theme?: string;
    profile_pic_url?: string;
}