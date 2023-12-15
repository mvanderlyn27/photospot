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
      photolist_photospots: {
        Row: {
          created_at: string
          photolist: number
          photospot: number
        }
        Insert: {
          created_at?: string
          photolist: number
          photospot: number
        }
        Update: {
          created_at?: string
          photolist?: number
          photospot?: number
        }
        Relationships: [
          {
            foreignKeyName: "photolist_photospots_photolist_fkey"
            columns: ["photolist"]
            isOneToOne: false
            referencedRelation: "photolist_rating_stats"
            referencedColumns: ["photolist_id"]
          },
          {
            foreignKeyName: "photolist_photospots_photolist_fkey"
            columns: ["photolist"]
            isOneToOne: false
            referencedRelation: "photolists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photolist_photospots_photospot_fkey"
            columns: ["photospot"]
            isOneToOne: false
            referencedRelation: "photospot_rating_stats"
            referencedColumns: ["photospot_id"]
          },
          {
            foreignKeyName: "photolist_photospots_photospot_fkey"
            columns: ["photospot"]
            isOneToOne: false
            referencedRelation: "photospots"
            referencedColumns: ["id"]
          }
        ]
      }
      photolist_reviews: {
        Row: {
          created_at: string
          created_by: string
          edited: boolean
          photo_paths: string[] | null
          photolist_id: number
          rating: number
          text: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          edited?: boolean
          photo_paths?: string[] | null
          photolist_id: number
          rating: number
          text?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          edited?: boolean
          photo_paths?: string[] | null
          photolist_id?: number
          rating?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photolist_reviews_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photolist_reviews_photolist_id_fkey"
            columns: ["photolist_id"]
            isOneToOne: false
            referencedRelation: "photolist_rating_stats"
            referencedColumns: ["photolist_id"]
          },
          {
            foreignKeyName: "photolist_reviews_photolist_id_fkey"
            columns: ["photolist_id"]
            isOneToOne: false
            referencedRelation: "photolists"
            referencedColumns: ["id"]
          }
        ]
      }
      photolists: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          edited: boolean
          id: number
          name: string
          photo_paths: string[] | null
          private: boolean
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          edited?: boolean
          id?: number
          name: string
          photo_paths?: string[] | null
          private?: boolean
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          edited?: boolean
          id?: number
          name?: string
          photo_paths?: string[] | null
          private?: boolean
        }
        Relationships: []
      }
      photospot_reviews: {
        Row: {
          created_at: string
          created_by: string
          edited: boolean
          photo_paths: string[] | null
          photospot_id: number
          rating: number
          text: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          edited?: boolean
          photo_paths?: string[] | null
          photospot_id: number
          rating: number
          text?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          edited?: boolean
          photo_paths?: string[] | null
          photospot_id?: number
          rating?: number
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "photospot_reviews_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photospot_reviews_photospot_id_fkey"
            columns: ["photospot_id"]
            isOneToOne: false
            referencedRelation: "photospot_rating_stats"
            referencedColumns: ["photospot_id"]
          },
          {
            foreignKeyName: "photospot_reviews_photospot_id_fkey"
            columns: ["photospot_id"]
            isOneToOne: false
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
          edited: boolean
          id: number
          location: unknown | null
          name: string
          photo_paths: string[]
          private: boolean | null
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          edited?: boolean
          id?: number
          location?: unknown | null
          name: string
          photo_paths: string[]
          private?: boolean | null
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          edited?: boolean
          id?: number
          location?: unknown | null
          name?: string
          photo_paths?: string[]
          private?: boolean | null
          tags?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          private: boolean
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          private?: boolean
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          private?: boolean
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles_priv: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["db_roles"]
          theme: Database["public"]["Enums"]["themes"]
        }
        Insert: {
          created_at?: string
          id: string
          role?: Database["public"]["Enums"]["db_roles"]
          theme?: Database["public"]["Enums"]["themes"]
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["db_roles"]
          theme?: Database["public"]["Enums"]["themes"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_priv_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      photolist_rating_stats: {
        Row: {
          photolist_id: number | null
          rating_average: number | null
          rating_count: number | null
        }
        Relationships: []
      }
      photospot_rating_stats: {
        Row: {
          photospot_id: number | null
          rating_average: number | null
          rating_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_random_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      create_test_user: {
        Args: {
          email: string
          password: string
          metadata: Json
        }
        Returns: undefined
      }
      create_user_metadata: {
        Args: {
          email: string
          password: string
          user_meta_data: Json
        }
        Returns: string
      }
      delete_current_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      delete_storage_object: {
        Args: {
          bucket: string
          object: string
        }
        Returns: Record<string, unknown>
      }
      generate_random_password: {
        Args: {
          length: number
        }
        Returns: string
      }
      get_random_user: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
      db_roles: "user" | "admin"
      themes: "dark" | "light" | "device"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
