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
      betaEmailList: {
        Row: {
          created_at: string
          email: string
          id: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
        }
        Relationships: []
      }
      photoshot_likes: {
        Row: {
          created_at: string
          created_by: string
          like_type: number
          photoshot_id: number
        }
        Insert: {
          created_at?: string
          created_by?: string
          like_type: number
          photoshot_id: number
        }
        Update: {
          created_at?: string
          created_by?: string
          like_type?: number
          photoshot_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "photoshot_likes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photoshot_likes_photoshot_id_fkey"
            columns: ["photoshot_id"]
            isOneToOne: false
            referencedRelation: "photoshots"
            referencedColumns: ["id"]
          },
        ]
      }
      photoshot_tags: {
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
            foreignKeyName: "photoshot_tags_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "photoshots"
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
      photoshots: {
        Row: {
          created_at: string
          created_by: string | null
          id: number
          name: string
          photo_paths: string[]
          photospot_id: number
          recreate_text: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: number
          name: string
          photo_paths?: string[]
          photospot_id: number
          recreate_text: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: number
          name?: string
          photo_paths?: string[]
          photospot_id?: number
          recreate_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "photoshots_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photoshots_photospot_id_fkey"
            columns: ["photospot_id"]
            isOneToOne: false
            referencedRelation: "photospot_rating_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photoshots_photospot_id_fkey"
            columns: ["photospot_id"]
            isOneToOne: false
            referencedRelation: "photospots"
            referencedColumns: ["id"]
          },
        ]
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
      photospots: {
        Row: {
          address: string | null
          created_at: string
          id: number
          location: unknown
          location_name: string
          neighborhood: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: number
          location: unknown
          location_name: string
          neighborhood: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: number
          location?: unknown
          location_name?: string
          neighborhood?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          photo_path: string | null
          private_profile: boolean
          username: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id: string
          photo_path?: string | null
          private_profile?: boolean
          username?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          photo_path?: string | null
          private_profile?: boolean
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
          theme: Database["public"]["Enums"]["themes"]
          user_role: Database["public"]["Enums"]["db_roles"]
        }
        Insert: {
          created_at?: string
          id: string
          theme?: Database["public"]["Enums"]["themes"]
          user_role?: Database["public"]["Enums"]["db_roles"]
        }
        Update: {
          created_at?: string
          id?: string
          theme?: Database["public"]["Enums"]["themes"]
          user_role?: Database["public"]["Enums"]["db_roles"]
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
      saved_photoshots: {
        Row: {
          created_at: string
          id: string
          photoshot_id: number
        }
        Insert: {
          created_at?: string
          id?: string
          photoshot_id: number
        }
        Update: {
          created_at?: string
          id?: string
          photoshot_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "saved_photoshots_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_photoshots_photoshot_id_fkey"
            columns: ["photoshot_id"]
            isOneToOne: false
            referencedRelation: "photoshots"
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
      user_follows: {
        Row: {
          created_at: string
          followee: string
          follower: string
        }
        Insert: {
          created_at?: string
          followee: string
          follower: string
        }
        Update: {
          created_at?: string
          followee?: string
          follower?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_followes_followee_fkey"
            columns: ["followee"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_followes_follower_fkey"
            columns: ["follower"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
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
      create_photospot_with_lat_lng: {
        Args: {
          location_namein: string
          addressin: string
          neighborhoodin: string
          locationin: unknown
        }
        Returns: {
          id: number
          location_name: string
          address: string
          neighborhood: string
          lat: number
          lng: number
        }[]
      }
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
      find_most_liked_photoshot: {
        Args: {
          input_id: number
        }
        Returns: {
          created_at: string
          created_by: string | null
          id: number
          name: string
          photo_paths: string[]
          photospot_id: number
          recreate_text: string
        }
      }
      find_photospot_by_lat_lng: {
        Args: {
          latitude: number
          longitude: number
        }
        Returns: {
          id: number
          location_name: string
          address: string
          neighborhood: string
          lat: number
          lng: number
        }[]
      }
      generate_random_password: {
        Args: {
          length: number
        }
        Returns: string
      }
      get_all_photospots_with_lat_lng: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          location_name: string
          address: string
          neighborhood: string
          lat: number
          lng: number
        }[]
      }
      get_photoshots_with_highest_likes: {
        Args: {
          time_range?: unknown
          page_size?: number
          page_count?: number
        }
        Returns: {
          id: number
          like_count: number
          name: string
          photo_paths: string[]
        }[]
      }
      get_photospot_by_id_lat_lng: {
        Args: {
          input_id: number
        }
        Returns: {
          id: number
          location_name: string
          address: string
          neighborhood: string
          lat: number
          lng: number
        }[]
      }
      get_random_user: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_saved_photospots: {
        Args: {
          user_id: string
          page_size?: number
          page_count?: number
        }
        Returns: {
          top_photoshot_id: number
          top_photoshot_path: string
          id: number
          lat: number
          lng: number
          neighborhood: string
          location_name: string
          address: string
        }[]
      }
      get_tags_for_photospot: {
        Args: {
          photospotid: number
        }
        Returns: string[]
      }
      nearby_photoshots: {
        Args: {
          latt: number
          long: number
          page_size?: number
          page_count?: number
        }
        Returns: {
          id: number
          name: string
          photospot_id: number
          photo_paths: string[]
          dist_meters: number
        }[]
      }
      nearby_photospots: {
        Args: {
          latt: number
          long: number
          page_size: number
          page_count: number
        }
        Returns: {
          id: number
          location_name: string
          address: string
          neighborhood: string
          lat: number
          lng: number
          dist_meters: number
        }[]
      }
      photoshot_like_count: {
        Args: {
          input_id: number
        }
        Returns: number
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
      recommend_photoshots: {
        Args: {
          user_id: string
          time_range?: unknown
          page_size?: number
          page_count?: number
        }
        Returns: {
          id: number
          name: string
          photospot_id: number
          photo_paths: string[]
          created_at: string
        }[]
      }
      search_photospots: {
        Args: {
          page_size?: number
          page_count?: number
          photospot_name?: string
          tags?: number[]
        }
        Returns: {
          address: string | null
          created_at: string
          id: number
          location: unknown
          location_name: string
          neighborhood: string
        }[]
      }
      search_profiles_by_username: {
        Args: {
          search_query: string
          page_size?: number
          page_count?: number
        }
        Returns: {
          id: string
          username: string
          created_at: string
          private_profile: boolean
          photo_path: string
          bio: string
        }[]
      }
      search_tags: {
        Args: {
          input_text: string
        }
        Returns: {
          id: number
          name: string
        }[]
      }
      update_photoshot_tags: {
        Args: {
          photoshot_id: number
          tag_ids: number[]
        }
        Returns: undefined
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
