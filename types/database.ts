// GENERATED from the live Supabase database — do not edit by hand.
// Regenerate after every migration (ask Claude, or: npx supabase gen types typescript --project-id bjrdrrwsnhfgozkegbug).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          email: string | null
          handled: boolean
          id: string
          message: string | null
          name: string
          phone: string
          property_id: string | null
          source: Database["public"]["Enums"]["inquiry_source"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          handled?: boolean
          id?: string
          message?: string | null
          name: string
          phone: string
          property_id?: string | null
          source?: Database["public"]["Enums"]["inquiry_source"]
        }
        Update: {
          created_at?: string
          email?: string | null
          handled?: boolean
          id?: string
          message?: string | null
          name?: string
          phone?: string
          property_id?: string | null
          source?: Database["public"]["Enums"]["inquiry_source"]
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          amenities: string[]
          area_sqft: number | null
          bathrooms: number | null
          bedrooms: number | null
          city: Database["public"]["Enums"]["city"]
          created_at: string
          description: string | null
          featured: boolean
          id: string
          images: string[]
          is_published: boolean
          listing_type: Database["public"]["Enums"]["listing_type"]
          location: string
          price: number
          price_display: string
          property_type: Database["public"]["Enums"]["property_type"]
          slug: string
          status: Database["public"]["Enums"]["property_status"]
          title: string
          updated_at: string
        }
        Insert: {
          amenities?: string[]
          area_sqft?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: Database["public"]["Enums"]["city"]
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: string[]
          is_published?: boolean
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location: string
          price: number
          price_display?: string
          property_type: Database["public"]["Enums"]["property_type"]
          slug: string
          status?: Database["public"]["Enums"]["property_status"]
          title: string
          updated_at?: string
        }
        Update: {
          amenities?: string[]
          area_sqft?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          city?: Database["public"]["Enums"]["city"]
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: string[]
          is_published?: boolean
          listing_type?: Database["public"]["Enums"]["listing_type"]
          location?: string
          price?: number
          price_display?: string
          property_type?: Database["public"]["Enums"]["property_type"]
          slug?: string
          status?: Database["public"]["Enums"]["property_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      city: "Delhi" | "Noida" | "Gurugram"
      inquiry_source: "contact" | "property"
      listing_type: "Sale" | "Rent"
      property_status: "Available" | "Under Offer" | "Sold"
      property_type:
        | "Apartment"
        | "Villa"
        | "Penthouse"
        | "Builder Floor"
        | "Plot"
        | "Commercial"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      city: ["Delhi", "Noida", "Gurugram"],
      inquiry_source: ["contact", "property"],
      listing_type: ["Sale", "Rent"],
      property_status: ["Available", "Under Offer", "Sold"],
      property_type: [
        "Apartment",
        "Villa",
        "Penthouse",
        "Builder Floor",
        "Plot",
        "Commercial",
      ],
    },
  },
} as const
