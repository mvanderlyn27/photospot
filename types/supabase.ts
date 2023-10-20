export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      photolist_reviews: {
        Row: {
          created_at: string
          created_by: string
          id: number
          photo_paths: string[] | null
          rating: number | null
          review_target: number
          text: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          photo_paths?: string[] | null
          rating?: number | null
          review_target: number
          text?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          photo_paths?: string[] | null
          rating?: number | null
          review_target?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photolist_reviews_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photolist_reviews_review_target_fkey"
            columns: ["review_target"]
            referencedRelation: "photospots"
            referencedColumns: ["id"]
          }
        ]
      }
      photolists: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          photospots: number[] | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          photospots?: number[] | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          photospots?: number[] | null
        }
        Relationships: []
      }
      photospot_reviews: {
        Row: {
          created_at: string
          created_by: string
          id: number
          photo_paths: string[] | null
          rating: number | null
          review_target: number
          text: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: number
          photo_paths?: string[] | null
          rating?: number | null
          review_target: number
          text?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          photo_paths?: string[] | null
          rating?: number | null
          review_target?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photospot_reviews_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photospot_reviews_review_target_fkey"
            columns: ["review_target"]
            referencedRelation: "photospots"
            referencedColumns: ["id"]
          }
        ]
      }
      photospots: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          draft: boolean | null
          id: number
          location: unknown | null
          name: string
          photo_paths: string[]
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          draft?: boolean | null
          id?: number
          location?: unknown | null
          name: string
          photo_paths: string[]
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          draft?: boolean | null
          id?: number
          location?: unknown | null
          name?: string
          photo_paths?: string[]
          tags?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string | null
          preferences: Json | null
          role: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string | null
          preferences?: Json | null
          role?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string | null
          preferences?: Json | null
          role?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
      nearby_photospots: {
        Args: {
          lat: number
          long: number
        }
        Returns: {
          id: number
          name: string
          lat: number
          long: number
          dist_meters: number
        }[]
      }
      photospots_in_view: {
        Args: {
          min_lat: number
          min_long: number
          max_lat: number
          max_long: number
        }
        Returns: {
          id: number
          name: string
          lat: number
          long: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
