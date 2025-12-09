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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      client_forms: {
        Row: {
          aceita_privacidade: boolean | null
          administracao: Json | null
          bairro: string | null
          capital_social: string | null
          celular: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          logradouro: string | null
          nome_fantasia: string | null
          numero: string | null
          objetivo_social: string | null
          porte_empresa: string | null
          quotas: Json | null
          razao_social: string
          razao_social_opcao2: string | null
          razao_social_opcao3: string | null
          referencia: string | null
          regime_tributario: string | null
          socio1: boolean | null
          socio1_data: Json | null
          socio2: boolean | null
          socio2_data: Json | null
          socio3: boolean | null
          socio3_data: Json | null
          telefone: string | null
          tipo_juridico: string | null
          uf: string | null
        }
        Insert: {
          aceita_privacidade?: boolean | null
          administracao?: Json | null
          bairro?: string | null
          capital_social?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          logradouro?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          objetivo_social?: string | null
          porte_empresa?: string | null
          quotas?: Json | null
          razao_social: string
          razao_social_opcao2?: string | null
          razao_social_opcao3?: string | null
          referencia?: string | null
          regime_tributario?: string | null
          socio1?: boolean | null
          socio1_data?: Json | null
          socio2?: boolean | null
          socio2_data?: Json | null
          socio3?: boolean | null
          socio3_data?: Json | null
          telefone?: string | null
          tipo_juridico?: string | null
          uf?: string | null
        }
        Update: {
          aceita_privacidade?: boolean | null
          administracao?: Json | null
          bairro?: string | null
          capital_social?: string | null
          celular?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          logradouro?: string | null
          nome_fantasia?: string | null
          numero?: string | null
          objetivo_social?: string | null
          porte_empresa?: string | null
          quotas?: Json | null
          razao_social?: string
          razao_social_opcao2?: string | null
          razao_social_opcao3?: string | null
          referencia?: string | null
          regime_tributario?: string | null
          socio1?: boolean | null
          socio1_data?: Json | null
          socio2?: boolean | null
          socio2_data?: Json | null
          socio3?: boolean | null
          socio3_data?: Json | null
          telefone?: string | null
          tipo_juridico?: string | null
          uf?: string | null
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
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
