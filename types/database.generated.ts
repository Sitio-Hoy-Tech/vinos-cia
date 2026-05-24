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
    PostgrestVersion: "14.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: string
          name: string
          position: number | null
          slug: string
          tenant_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name: string
          position?: number | null
          slug: string
          tenant_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          name?: string
          position?: number | null
          slug?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          category_id: string | null
          content: string | null
          cover_image: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          content?: string | null
          cover_image?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean | null
          id: string
          name: string
          position: number | null
          slug: string
          tenant_id: string
        }
        Insert: {
          active?: boolean | null
          id?: string
          name: string
          position?: number | null
          slug: string
          tenant_id: string
        }
        Update: {
          active?: boolean | null
          id?: string
          name?: string
          position?: number | null
          slug?: string
          tenant_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          source: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          source?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          source?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean | null
          code: string
          expires_at: string | null
          id: string
          max_uses: number | null
          min_amount: number | null
          starts_at: string | null
          tenant_id: string
          type: string
          uses_count: number | null
          value: number
        }
        Insert: {
          active?: boolean | null
          code: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_amount?: number | null
          starts_at?: string | null
          tenant_id: string
          type: string
          uses_count?: number | null
          value: number
        }
        Update: {
          active?: boolean | null
          code?: string
          expires_at?: string | null
          id?: string
          max_uses?: number | null
          min_amount?: number | null
          starts_at?: string | null
          tenant_id?: string
          type?: string
          uses_count?: number | null
          value?: number
        }
        Relationships: []
      }
      crm_webhook_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      order_events: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          payload: Json | null
          tenant_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          payload?: Json | null
          tenant_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          payload?: Json | null
          tenant_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          name: string
          order_id: string | null
          product_id: string | null
          quantity: number
          tenant_id: string
          unit_price: number
          variant_id: string | null
          variant_name: string | null
        }
        Insert: {
          id?: string
          name: string
          order_id?: string | null
          product_id?: string | null
          quantity: number
          tenant_id: string
          unit_price: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Update: {
          id?: string
          name?: string
          order_id?: string | null
          product_id?: string | null
          quantity?: number
          tenant_id?: string
          unit_price?: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          coupon_code: string | null
          created_at: string | null
          currency: string | null
          customer_first_name: string | null
          customer_last_name: string | null
          customer_phone: string | null
          discount_amount: number | null
          external_reference: string | null
          id: string
          mp_payment_id: string | null
          notes: string | null
          payer_email: string | null
          payment_provider: string | null
          payment_status: string | null
          shipping_address: Json | null
          shipping_carrier: string | null
          shipping_cost: number | null
          shipping_label_url: string | null
          shipping_postal_code: string | null
          shipping_service: string | null
          shipping_tracking_number: string | null
          status: string | null
          tenant_id: string | null
          total: number | null
          tracking_token: string | null
          updated_at: string | null
        }
        Insert: {
          coupon_code?: string | null
          created_at?: string | null
          currency?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          external_reference?: string | null
          id?: string
          mp_payment_id?: string | null
          notes?: string | null
          payer_email?: string | null
          payment_provider?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_carrier?: string | null
          shipping_cost?: number | null
          shipping_label_url?: string | null
          shipping_postal_code?: string | null
          shipping_service?: string | null
          shipping_tracking_number?: string | null
          status?: string | null
          tenant_id?: string | null
          total?: number | null
          tracking_token?: string | null
          updated_at?: string | null
        }
        Update: {
          coupon_code?: string | null
          created_at?: string | null
          currency?: string | null
          customer_first_name?: string | null
          customer_last_name?: string | null
          customer_phone?: string | null
          discount_amount?: number | null
          external_reference?: string | null
          id?: string
          mp_payment_id?: string | null
          notes?: string | null
          payer_email?: string | null
          payment_provider?: string | null
          payment_status?: string | null
          shipping_address?: Json | null
          shipping_carrier?: string | null
          shipping_cost?: number | null
          shipping_label_url?: string | null
          shipping_postal_code?: string | null
          shipping_service?: string | null
          shipping_tracking_number?: string | null
          status?: string | null
          tenant_id?: string | null
          total?: number | null
          tracking_token?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_events: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          payload: Json | null
          provider: string
          provider_event_id: string | null
          status: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          payload?: Json | null
          provider?: string
          provider_event_id?: string | null
          status?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          payload?: Json | null
          provider?: string
          provider_event_id?: string | null
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_config: {
        Row: {
          correo_argentino_customer_id: string | null
          correo_argentino_password: string | null
          correo_argentino_token: string | null
          correo_argentino_token_expires_at: string | null
          correo_argentino_user: string | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          correo_argentino_customer_id?: string | null
          correo_argentino_password?: string | null
          correo_argentino_token?: string | null
          correo_argentino_token_expires_at?: string | null
          correo_argentino_user?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          correo_argentino_customer_id?: string | null
          correo_argentino_password?: string | null
          correo_argentino_token?: string | null
          correo_argentino_token_expires_at?: string | null
          correo_argentino_user?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt: string | null
          id: string
          position: number | null
          product_id: string | null
          tenant_id: string
          url: string
        }
        Insert: {
          alt?: string | null
          id?: string
          position?: number | null
          product_id?: string | null
          tenant_id: string
          url: string
        }
        Update: {
          alt?: string | null
          id?: string
          position?: number | null
          product_id?: string | null
          tenant_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_images_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          id: string
          name: string
          price: number | null
          price_modifier: number | null
          product_id: string | null
          sku: string | null
          stock: number | null
          tenant_id: string
        }
        Insert: {
          id?: string
          name: string
          price?: number | null
          price_modifier?: number | null
          product_id?: string | null
          sku?: string | null
          stock?: number | null
          tenant_id: string
        }
        Update: {
          id?: string
          name?: string
          price?: number | null
          price_modifier?: number | null
          product_id?: string | null
          sku?: string | null
          stock?: number | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_variants_product"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active: boolean | null
          category_id: string | null
          compare_at_price: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          featured: boolean | null
          height_cm: number | null
          id: string
          is_sale: boolean | null
          length_cm: number | null
          name: string
          position: number | null
          price: number
          sale_price: number | null
          shipping_required: boolean | null
          slug: string | null
          stock: number | null
          stock_unlimited: boolean | null
          tenant_id: string
          updated_at: string | null
          updated_by: string | null
          weight_grams: number | null
          width_cm: number | null
        }
        Insert: {
          active?: boolean | null
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          height_cm?: number | null
          id?: string
          is_sale?: boolean | null
          length_cm?: number | null
          name: string
          position?: number | null
          price: number
          sale_price?: number | null
          shipping_required?: boolean | null
          slug?: string | null
          stock?: number | null
          stock_unlimited?: boolean | null
          tenant_id: string
          updated_at?: string | null
          updated_by?: string | null
          weight_grams?: number | null
          width_cm?: number | null
        }
        Update: {
          active?: boolean | null
          category_id?: string | null
          compare_at_price?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          featured?: boolean | null
          height_cm?: number | null
          id?: string
          is_sale?: boolean | null
          length_cm?: number | null
          name?: string
          position?: number | null
          price?: number
          sale_price?: number | null
          shipping_required?: boolean | null
          slug?: string | null
          stock?: number | null
          stock_unlimited?: boolean | null
          tenant_id?: string
          updated_at?: string | null
          updated_by?: string | null
          weight_grams?: number | null
          width_cm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_zones: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          name: string
          position: number | null
          price: number
          tenant_id: string
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id?: string
          name: string
          position?: number | null
          price: number
          tenant_id: string
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          name?: string
          position?: number | null
          price?: number
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_zones_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      subcategories: {
        Row: {
          active: boolean | null
          category_id: string
          id: string
          name: string
          position: number | null
          slug: string
          tenant_id: string
        }
        Insert: {
          active?: boolean | null
          category_id: string
          id?: string
          name: string
          position?: number | null
          slug: string
          tenant_id: string
        }
        Update: {
          active?: boolean | null
          category_id?: string
          id?: string
          name?: string
          position?: number | null
          slug?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_subcategories_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          contact_email: string | null
          correo_argentino_customer_id: string | null
          correo_argentino_token: string | null
          correo_argentino_token_expires_at: string | null
          created_at: string | null
          current_period_end: string | null
          envia_access_token: string | null
          id: string
          max_products: number | null
          mp_access_token: string | null
          mp_public_key: string | null
          name: string
          origin_address: string | null
          origin_city: string | null
          origin_name: string | null
          origin_phone: string | null
          origin_postal_code: string | null
          origin_state: string | null
          plan: string | null
          resend_api_key: string | null
          revalidation_secret: string | null
          slug: string
          status: string | null
          subscription_id: string | null
          subscription_status: string | null
          umami_url: string | null
          umami_website_id: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          contact_email?: string | null
          correo_argentino_customer_id?: string | null
          correo_argentino_token?: string | null
          correo_argentino_token_expires_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          envia_access_token?: string | null
          id?: string
          max_products?: number | null
          mp_access_token?: string | null
          mp_public_key?: string | null
          name: string
          origin_address?: string | null
          origin_city?: string | null
          origin_name?: string | null
          origin_phone?: string | null
          origin_postal_code?: string | null
          origin_state?: string | null
          plan?: string | null
          resend_api_key?: string | null
          revalidation_secret?: string | null
          slug: string
          status?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          umami_url?: string | null
          umami_website_id?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          contact_email?: string | null
          correo_argentino_customer_id?: string | null
          correo_argentino_token?: string | null
          correo_argentino_token_expires_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          envia_access_token?: string | null
          id?: string
          max_products?: number | null
          mp_access_token?: string | null
          mp_public_key?: string | null
          name?: string
          origin_address?: string | null
          origin_city?: string | null
          origin_name?: string | null
          origin_phone?: string | null
          origin_postal_code?: string | null
          origin_state?: string | null
          plan?: string | null
          resend_api_key?: string | null
          revalidation_secret?: string | null
          slug?: string
          status?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          umami_url?: string | null
          umami_website_id?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      user_tenants: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_tenants_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tenant_id: { Args: never; Returns: string }
      isr_notify: {
        Args: { p_slug?: string; p_table: string; p_tenant_id: string }
        Returns: undefined
      }
      tenant_id: { Args: never; Returns: string }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
