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
    location?: LatLng;
    draft?: boolean;
}

export type Photospot  = {
    created_at?: string;
    created_by?: string;
    description?: string;
    id: number;
    name: string;
    photo_paths: string[];
    location: LatLng;
    draft?: boolean;
}
export type LatLng = {
    latitude: number;
    longitude: number;
}

export type PhotoGridInput = {
    photospots: Photospot[] | undefined
}