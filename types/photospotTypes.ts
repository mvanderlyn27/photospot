export type Photolist = {
    created_at?: string;
    created_by?: string | null;
    description?: string | null;
    id: number;
    name: string;
    photospots?: number[];
    photo_paths: string[];
    rating_average?: number;
    rating_count?: number;
};
export type PhotolistInput = {
    created_at?: string;
    created_by?: string;
    description?: string;
    name: string;
};
export type PhotospotInput = {
    description?: string;
    name?: string;
    location?: string;
    draft?: boolean;
    photo_paths?: string[];
};

export type Photospot = {
    created_at?: string;
    created_by?: string;
    description: string | null;
    id: number;
    name: string;
    photo_paths: string[];
    location: unknown;
    lat: number;
    lng: number;
    draft?: boolean;
    photo_placeholder?: "blur" | "empty" | `data:image/${string}` | undefined;
    username?: string | null;
    neighborhood?: string | null;
};
export type PhotospotStats = {
    id: number | null;
    rating_count: number | null;
    rating_average: number | null;
}
export type PhotospotInsert = {
    description?: string;
    name: string;
    photo_paths: string[];
    location: string;
    draft?: boolean;
};
export type PhotobookPicture = {
    id: number;
    photospot_id: number
    name: string;
    description: string;
    photo_paths: string[];
    created_by?: string | null;
    username?: string | null;
}
export type Review = {
    id: number
    created_at?: string;
    created_by: string;
    photospot_id: number;
    text?: string | null;
    photo_paths: string[];
    rating: number;
    username?: string | null;
}

export type ReviewGridInput = {
    path: string;
    name: string;
    review?: string;
};

export type PublicProfile = {
    id: number;
    username: string;
    private?: boolean;
    role?: string;
    theme?: string;
    profile_pic_url?: string;
    email?: string;
    password?: string;
};
export type PhotospotReview = {
    created_by: string;
    photospot_id: number;
    photo_paths?: string[];
    rating?: number;
    text?: string;
    edited?: boolean;
};
export type PhotolistReview = {
    created_by: string;
    photolist_id: number;
    photo_paths?: string[];
    rating?: number;
    text?: string;
    edited?: boolean;
};
export type RatingStat = {
    id: number;
    rating_count?: number;
    rating_average?: number;
};
export type GoldenHourDisplayInfo = {
    type: PhotoTime;
    time: Date;
}
export type PhotoTimeWidgetInfo = {
    time: Date;
    time_label: PhotoTime;
    weather: Weather;
};



export enum Weather {
    sun,
    clouds,
    rain,
    hail,
    snow,
    storm,
}
export enum PhotoTime {
    golden_hour_morning,
    golden_hour_evening,
}
