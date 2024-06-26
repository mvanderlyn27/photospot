export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
            referencedColumns: ["id"]
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
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photolist_photospots_photospot_fkey"
            columns: ["photospot"]
            isOneToOne: false
            referencedRelation: "photospots"
            referencedColumns: ["id"]
          },
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
          created_by: string
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
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photolist_reviews_photolist_id_fkey"
            columns: ["photolist_id"]
            isOneToOne: false
            referencedRelation: "photolists"
            referencedColumns: ["id"]
          },
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
          id: number
          photospot_id: number
          rating: number
          text: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          edited?: boolean
          id?: number
          photospot_id: number
          rating: number
          text?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          edited?: boolean
          id?: number
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
            foreignKeyName: "photospot_reviews_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photospot_reviews_photospot_id_fkey"
            columns: ["photospot_id"]
            isOneToOne: false
            referencedRelation: "photospot_rating_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photospot_reviews_photospot_id_fkey"
            columns: ["photospot_id"]
            isOneToOne: false
            referencedRelation: "photospots"
            referencedColumns: ["id"]
          },
        ]
      }
      photospot_tags: {
        Row: {
          created_at: string
          id: number
          tag_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          tag_id: number
        }
        Update: {
          created_at?: string
          id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "photospot_tags_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "photospot_rating_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photospot_tags_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "photospots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photospot_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      photospots: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          edited: boolean
          id: number
          lat: number
          lng: number
          location: unknown
          name: string
          neighborhood: string | null
          photo_paths: string[]
          private: boolean | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          edited?: boolean
          id?: number
          lat: number
          lng: number
          location: unknown
          name: string
          neighborhood?: string | null
          photo_paths: string[]
          private?: boolean | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          edited?: boolean
          id?: number
          lat?: number
          lng?: number
          location?: unknown
          name?: string
          neighborhood?: string | null
          photo_paths?: string[]
          private?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "photospots_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      photospots_photobook_pictures: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: number
          name: string
          photo_paths: string[]
          photospot_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: number
          name: string
          photo_paths?: string[]
          photospot_id: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: number
          name?: string
          photo_paths?: string[]
          photospot_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "photospots_photobook_pictures_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photospots_photobook_pictures_photospot_id_fkey"
            columns: ["photospot_id"]
            isOneToOne: false
            referencedRelation: "photospot_rating_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photospots_photobook_pictures_photospot_id_fkey"
            columns: ["photospot_id"]
            isOneToOne: false
            referencedRelation: "photospots"
            referencedColumns: ["id"]
          },
        ]
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
          },
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
          },
        ]
      }
      saved_photospots: {
        Row: {
          created_at: string
          id: string
          photospot: number
        }
        Insert: {
          created_at?: string
          id: string
          photospot: number
        }
        Update: {
          created_at?: string
          id?: string
          photospot?: number
        }
        Relationships: [
          {
            foreignKeyName: "saved_photospots_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_photospots_photospot_fkey"
            columns: ["photospot"]
            isOneToOne: false
            referencedRelation: "photospot_rating_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_photospots_photospot_fkey"
            columns: ["photospot"]
            isOneToOne: false
            referencedRelation: "photospots"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      photolist_rating_stats: {
        Row: {
          id: number | null
          rating_average: number | null
          rating_count: number | null
        }
        Relationships: []
      }
      photospot_rating_stats: {
        Row: {
          id: number | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
