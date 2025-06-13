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
      active_crops: {
        Row: {
          acres: number | null
          created_at: string | null
          crop_id: string | null
          harvest_date: string | null
          id: string
          planting_date: string | null
          selling_price: number | null
          status: string | null
          total_investment: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          acres?: number | null
          created_at?: string | null
          crop_id?: string | null
          harvest_date?: string | null
          id?: string
          planting_date?: string | null
          selling_price?: number | null
          status?: string | null
          total_investment?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          acres?: number | null
          created_at?: string | null
          crop_id?: string | null
          harvest_date?: string | null
          id?: string
          planting_date?: string | null
          selling_price?: number | null
          status?: string | null
          total_investment?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "active_crops_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_expenses: {
        Row: {
          active_crop_id: string | null
          amount: number
          created_at: string | null
          expense_date: string | null
          id: string
          notes: string | null
        }
        Insert: {
          active_crop_id?: string | null
          amount: number
          created_at?: string | null
          expense_date?: string | null
          id?: string
          notes?: string | null
        }
        Update: {
          active_crop_id?: string | null
          amount?: number
          created_at?: string | null
          expense_date?: string | null
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_expenses_active_crop_id_fkey"
            columns: ["active_crop_id"]
            isOneToOne: false
            referencedRelation: "active_crops"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_history: {
        Row: {
          acres: number | null
          created_at: string | null
          crop_name: string
          harvest_date: string | null
          id: string
          mandi_name: string | null
          planting_date: string | null
          profit: number | null
          selling_price: number | null
          total_investment: number | null
          user_id: string | null
        }
        Insert: {
          acres?: number | null
          created_at?: string | null
          crop_name: string
          harvest_date?: string | null
          id?: string
          mandi_name?: string | null
          planting_date?: string | null
          profit?: number | null
          selling_price?: number | null
          total_investment?: number | null
          user_id?: string | null
        }
        Update: {
          acres?: number | null
          created_at?: string | null
          crop_name?: string
          harvest_date?: string | null
          id?: string
          mandi_name?: string | null
          planting_date?: string | null
          profit?: number | null
          selling_price?: number | null
          total_investment?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      crops_master: {
        Row: {
          category: string | null
          created_at: string | null
          hindi_name: string | null
          id: string
          kannada_name: string | null
          malayalam_name: string | null
          name: string
          tamil_name: string | null
          telugu_name: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          hindi_name?: string | null
          id?: string
          kannada_name?: string | null
          malayalam_name?: string | null
          name: string
          tamil_name?: string | null
          telugu_name?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          hindi_name?: string | null
          id?: string
          kannada_name?: string | null
          malayalam_name?: string | null
          name?: string
          tamil_name?: string | null
          telugu_name?: string | null
        }
        Relationships: []
      }
      mandis_master: {
        Row: {
          address: string | null
          created_at: string | null
          district: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          state: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          district: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          state: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          district?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          state?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          district: string | null
          id: string
          phone_number: string | null
          preferred_mandi: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          district?: string | null
          id: string
          phone_number?: string | null
          preferred_mandi?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          district?: string | null
          id?: string
          phone_number?: string | null
          preferred_mandi?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_crops: {
        Row: {
          created_at: string | null
          crop_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          crop_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          crop_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_crops_crop_id_fkey"
            columns: ["crop_id"]
            isOneToOne: false
            referencedRelation: "crops_master"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
