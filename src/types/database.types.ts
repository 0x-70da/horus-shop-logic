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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line: string
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean
          phone: string | null
          state: string | null
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address_line: string
          city: string
          country?: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean
          phone?: string | null
          state?: string | null
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address_line?: string
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean
          phone?: string | null
          state?: string | null
          user_id?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo: string | null
          name: string
          products_count: number
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo?: string | null
          name: string
          products_count?: number
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo?: string | null
          name?: string
          products_count?: number
          slug?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_price"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          featured: boolean
          icon: string | null
          id: string
          image: string | null
          is_active: boolean
          name: string
          products_count: number
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured?: boolean
          icon?: string | null
          id?: string
          image?: string | null
          is_active?: boolean
          name: string
          products_count?: number
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          featured?: boolean
          icon?: string | null
          id?: string
          image?: string | null
          is_active?: boolean
          name?: string
          products_count?: number
          slug?: string
        }
        Relationships: []
      }
      flash_deals: {
        Row: {
          created_at: string
          deal_quantity: number | null
          discount_percent: number
          end_date: string
          id: string
          is_active: boolean
          product_id: string
          sold_count: number
          start_date: string
          variant_id: string | null
        }
        Insert: {
          created_at?: string
          deal_quantity?: number | null
          discount_percent: number
          end_date: string
          id?: string
          is_active?: boolean
          product_id: string
          sold_count?: number
          start_date: string
          variant_id?: string | null
        }
        Update: {
          created_at?: string
          deal_quantity?: number | null
          discount_percent?: number
          end_date?: string
          id?: string
          is_active?: boolean
          product_id?: string
          sold_count?: number
          start_date?: string
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flash_deals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flash_deals_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_price"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flash_deals_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          line_total: number
          order_id: string
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          unit_price: number
          variant_id: string | null
          variant_name: string | null
        }
        Insert: {
          id?: string
          line_total: number
          order_id: string
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity: number
          unit_price: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Update: {
          id?: string
          line_total?: number
          order_id?: string
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
          variant_id?: string | null
          variant_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
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
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_price"
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
          address_id: string | null
          created_at: string
          discount: number
          id: string
          notes: string | null
          order_number: string
          payment_intent_id: string | null
          payment_method: string
          promo_code_id: string | null
          shipping: number
          shipping_method_id: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address_id?: string | null
          created_at?: string
          discount?: number
          id?: string
          notes?: string | null
          order_number: string
          payment_intent_id?: string | null
          payment_method?: string
          promo_code_id?: string | null
          shipping?: number
          shipping_method_id?: string | null
          status?: string
          subtotal: number
          tax?: number
          total: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address_id?: string | null
          created_at?: string
          discount?: number
          id?: string
          notes?: string | null
          order_number?: string
          payment_intent_id?: string | null
          payment_method?: string
          promo_code_id?: string | null
          shipping?: number
          shipping_method_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_method_id_fkey"
            columns: ["shipping_method_id"]
            isOneToOne: false
            referencedRelation: "shipping_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          created_at: string
          id: string
          is_active: boolean
          name: string
          price_modifier: number
          product_id: string
          sku: string
          stock: number
        }
        Insert: {
          attributes?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          price_modifier?: number
          product_id: string
          sku: string
          stock?: number
        }
        Update: {
          attributes?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          price_modifier?: number
          product_id?: string
          sku?: string
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_price"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: string | null
          category_id: string
          created_at: string
          description: string | null
          id: string
          images: string[]
          is_active: boolean
          name: string
          price: number
          rating: number
          review_count: number
          slug: string
          stock: number
          subcategory_id: string | null
          tags: string[]
          total_sold: number
          updated_at: string
        }
        Insert: {
          brand_id?: string | null
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          name: string
          price: number
          rating?: number
          review_count?: number
          slug: string
          stock?: number
          subcategory_id?: string | null
          tags?: string[]
          total_sold?: number
          updated_at?: string
        }
        Update: {
          brand_id?: string | null
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          is_active?: boolean
          name?: string
          price?: number
          rating?: number
          review_count?: number
          slug?: string
          stock?: number
          subcategory_id?: string | null
          tags?: string[]
          total_sold?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_banners: {
        Row: {
          background_color: string | null
          created_at: string
          cta_link: string | null
          cta_text: string | null
          end_date: string | null
          id: string
          image: string
          is_active: boolean
          start_date: string | null
          subtitle: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          background_color?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          end_date?: string | null
          id?: string
          image: string
          is_active?: boolean
          start_date?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          background_color?: string | null
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          end_date?: string | null
          id?: string
          image?: string
          is_active?: boolean
          start_date?: string | null
          subtitle?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promo_code_uses: {
        Row: {
          id: string
          order_id: string | null
          promo_code_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          promo_code_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          id?: string
          order_id?: string | null
          promo_code_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_uses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_uses_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_uses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number
          min_order_amount: number
          type: string
          used_count: number
          value: number
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          min_order_amount?: number
          type: string
          used_count?: number
          value: number
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          min_order_amount?: number
          type?: string
          used_count?: number
          value?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          helpful: number
          id: string
          order_id: string | null
          product_id: string
          rating: number
          title: string | null
          user_id: string
          verified: boolean
        }
        Insert: {
          comment?: string | null
          created_at?: string
          helpful?: number
          id?: string
          order_id?: string | null
          product_id: string
          rating: number
          title?: string | null
          user_id: string
          verified?: boolean
        }
        Update: {
          comment?: string | null
          created_at?: string
          helpful?: number
          id?: string
          order_id?: string | null
          product_id?: string
          rating?: number
          title?: string | null
          user_id?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_price"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_methods: {
        Row: {
          base_cost: number
          carrier: string | null
          created_at: string
          estimated_days: number
          free_above: number | null
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          base_cost: number
          carrier?: string | null
          created_at?: string
          estimated_days: number
          free_above?: number | null
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          base_cost?: number
          carrier?: string | null
          created_at?: string
          estimated_days?: number
          free_above?: number | null
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      subcategories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          products_count: number
          slug: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          products_count?: number
          slug: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          products_count?: number
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_rates: {
        Row: {
          country: string
          created_at: string
          id: string
          is_active: boolean
          rate: number
          region: string | null
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          is_active?: boolean
          rate: number
          region?: string | null
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          rate?: number
          region?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          password: string
          phone: string | null
          refresh_token: string | null
          reset_code: string | null
          reset_expires_at: string | null
          reset_token: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          password: string
          phone?: string | null
          refresh_token?: string | null
          reset_code?: string | null
          reset_expires_at?: string | null
          reset_token?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          password?: string
          phone?: string | null
          refresh_token?: string | null
          reset_code?: string | null
          reset_expires_at?: string | null
          reset_token?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      wishlist_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products_with_price"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      products_with_price: {
        Row: {
          brand_id: string | null
          category_id: string | null
          created_at: string | null
          current_price: number | null
          deal_discount_percent: number | null
          deal_ends_at: string | null
          deal_id: string | null
          deal_quantity: number | null
          deal_sold_count: number | null
          description: string | null
          id: string | null
          images: string[] | null
          is_active: boolean | null
          name: string | null
          price: number | null
          rating: number | null
          review_count: number | null
          slug: string | null
          stock: number | null
          subcategory_id: string | null
          tags: string[] | null
          total_sold: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cancel_order: {
        Args: { p_order_id: string; p_user_id: string }
        Returns: Json
      }
      get_current_price: { Args: { p_product_id: string }; Returns: number }
      place_order: {
        Args: {
          p_address_id: string
          p_promo_code?: string
          p_shipping_method_id: string
          p_user_id: string
        }
        Returns: Json
      }
      update_order_status: {
        Args: { p_order_id: string; p_status: string }
        Returns: Json
      }
      validate_promo_code: {
        Args: { p_code: string; p_total: number; p_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      user_role: "user" | "admin"
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
    Enums: {
      user_role: ["user", "admin"],
    },
  },
} as const
