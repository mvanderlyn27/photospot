export type Photospot = {
  created_at?: string;
  created_by?: string;
  id: number;
  location: unknown;
  lat: number;
  lng: number;
  location_name: string;
  neighborhood?: string | null;
};
export type PhotospotStats = {
  id: number | null;
  rating_count: number | null;
  rating_average: number | null;
};
export type PhotospotInsert = {
  description?: string;
  name: string;
  photo_paths: string[];
  location: string;
  draft?: boolean;
};
export type Photoshot = {
  id: number;
  photospot_id: number;
  name: string;
  recreate_text: string;
  photo_paths: string[];
  created_by?: string | null;
  username?: string | null;
  likes: number | null;
};
export type Review = {
  id: number;
  created_at?: string;
  created_by: string;
  photospot_id: number;
  text?: string | null;
  rating: number;
  username?: string | null;
};

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
};
export type PhotoTimeWidgetInfo = {
  time: Date;
  time_label: PhotoTime;
  weather: Weather | undefined;
};

export enum Weather {
  sun,
  clouds,
  rain,
  hail,
  snow,
  storm,
  drizzle,
}
export enum PhotoTime {
  golden_hour_morning,
  golden_hour_evening,
}
