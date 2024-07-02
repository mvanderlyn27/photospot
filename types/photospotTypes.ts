export type Photospot = {
  created_at?: string;
  created_by?: string | null;
  id: number;
  top_photo_path?: string | null;
  lat: number;
  lng: number;
  location_name: string;
  address: string;
  neighborhood?: string | null;
  rating?: number | null;
  dist_meters?: number | null;
  top_photoshot_id?: number;
  top_photoshot_path?: string;
};
export interface NearbyPhotospot extends Photospot {
  dist_meters: number;
}
export type NewPhotospotInfo = {
  location_name: string;
  address: string;
  neighborhood: string;
  lat: number;
  lng: number;
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
  created_at?: string;
  username?: string | null;
  like_count?: number | null;
  is_saved?: boolean;
  is_liked?: boolean;
  owner?: boolean;
  tags?: Tag[];
  dist_meters?: number;
};
export type Tag = {
  id: number;
  name?: string;
  created_at?: string;
};
export type Review = {
  id?: number;
  created_at?: string;
  created_by: string;
  photospot_id: number;
  text?: string | null;
  rating: number;
  username?: string | null;
  owner?: boolean;
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
export type PhotoTimeDisplayInfo = {
  start: Date;
  end: Date;
  time_label: PhotoTime;
  weather: Weather | undefined;
  temp: number | undefined;
};

export type Profile = {
  id: string;
  username: string | null;
  bio: string | null;
  photo_path: string | null;
  theme?: Themes;
  private_profile?: boolean;
  email?: string;
  role?: string;
}

export enum Weather {
  sun = 1,
  clouds = 2,
  rain = 3,
  hail = 4,
  snow = 5,
  storm = 6,
  drizzle = 7,
}
export enum PhotoTime {
  golden_hour_morning,
  golden_hour_evening,
}
export enum Themes {
  light='light',
  dark='dark',
  device='device'
}
