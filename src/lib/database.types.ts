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
          city: string
          company_id: string | null
          country_code: string
          created_at: string
          id: string
          label: string | null
          line1: string
          line2: string | null
          postal_code: string | null
          province: string | null
          recipient_name: string | null
          type: Database["public"]["Enums"]["address_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          city: string
          company_id?: string | null
          country_code?: string
          created_at?: string
          id?: string
          label?: string | null
          line1: string
          line2?: string | null
          postal_code?: string | null
          province?: string | null
          recipient_name?: string | null
          type?: Database["public"]["Enums"]["address_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          city?: string
          company_id?: string | null
          country_code?: string
          created_at?: string
          id?: string
          label?: string | null
          line1?: string
          line2?: string | null
          postal_code?: string | null
          province?: string | null
          recipient_name?: string | null
          type?: Database["public"]["Enums"]["address_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      artwork_approvals: {
        Row: {
          approved: boolean
          approved_at: string
          comment: string | null
          company_id: string | null
          customer_id: string | null
          id: string
          order_id: string
          proof_id: string
        }
        Insert: {
          approved: boolean
          approved_at?: string
          comment?: string | null
          company_id?: string | null
          customer_id?: string | null
          id?: string
          order_id: string
          proof_id: string
        }
        Update: {
          approved?: boolean
          approved_at?: string
          comment?: string | null
          company_id?: string | null
          customer_id?: string | null
          id?: string
          order_id?: string
          proof_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_approvals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_approvals_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_approvals_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_approvals_proof_id_fkey"
            columns: ["proof_id"]
            isOneToOne: true
            referencedRelation: "proofs"
            referencedColumns: ["id"]
          },
        ]
      }
      artwork_files: {
        Row: {
          bucket_id: string
          checksum: string | null
          company_id: string | null
          created_at: string
          customer_id: string | null
          file_size_bytes: number
          id: string
          mime_type: string
          order_id: string | null
          original_filename: string
          quote_id: string | null
          source_type: Database["public"]["Enums"]["artwork_source"]
          status: Database["public"]["Enums"]["artwork_status"]
          storage_path: string
          updated_at: string
          uploaded_by: string | null
          version: number
        }
        Insert: {
          bucket_id: string
          checksum?: string | null
          company_id?: string | null
          created_at?: string
          customer_id?: string | null
          file_size_bytes: number
          id?: string
          mime_type: string
          order_id?: string | null
          original_filename: string
          quote_id?: string | null
          source_type: Database["public"]["Enums"]["artwork_source"]
          status?: Database["public"]["Enums"]["artwork_status"]
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
          version?: number
        }
        Update: {
          bucket_id?: string
          checksum?: string | null
          company_id?: string | null
          created_at?: string
          customer_id?: string | null
          file_size_bytes?: number
          id?: string
          mime_type?: string
          order_id?: string | null
          original_filename?: string
          quote_id?: string | null
          source_type?: Database["public"]["Enums"]["artwork_source"]
          status?: Database["public"]["Enums"]["artwork_status"]
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "artwork_files_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_files_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_files_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      artwork_reviews: {
        Row: {
          artwork_file_id: string
          created_at: string
          id: string
          notes: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["artwork_review_status"]
        }
        Insert: {
          artwork_file_id: string
          created_at?: string
          id?: string
          notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["artwork_review_status"]
        }
        Update: {
          artwork_file_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["artwork_review_status"]
        }
        Relationships: [
          {
            foreignKeyName: "artwork_reviews_artwork_file_id_fkey"
            columns: ["artwork_file_id"]
            isOneToOne: false
            referencedRelation: "artwork_files"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          metadata: Json
        }
        Insert: {
          action: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          metadata?: Json
        }
        Update: {
          action?: string
          actor_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          metadata?: Json
        }
        Relationships: []
      }
      bundle_items: {
        Row: {
          bundle_id: string
          child_bundle_id: string | null
          created_at: string
          id: string
          product_variant_id: string | null
          quantity: number
        }
        Insert: {
          bundle_id: string
          child_bundle_id?: string | null
          created_at?: string
          id?: string
          product_variant_id?: string | null
          quantity?: number
        }
        Update: {
          bundle_id?: string
          child_bundle_id?: string | null
          created_at?: string
          id?: string
          product_variant_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "bundle_items_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_child_bundle_id_fkey"
            columns: ["child_bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      bundles: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          fixed_price_cents: number | null
          id: string
          name: string
          price_mode: string
          pricing_snapshot: Json
          slug: string
          status: Database["public"]["Enums"]["bundle_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          fixed_price_cents?: number | null
          id?: string
          name: string
          price_mode?: string
          pricing_snapshot?: Json
          slug: string
          status?: Database["public"]["Enums"]["bundle_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          fixed_price_cents?: number | null
          id?: string
          name?: string
          price_mode?: string
          pricing_snapshot?: Json
          slug?: string
          status?: Database["public"]["Enums"]["bundle_status"]
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          branding_notes: string | null
          cart_id: string
          configuration: Json
          created_at: string
          currency: string
          id: string
          product_variant_id: string
          quantity: number
          unit_price_cents: number
          updated_at: string
        }
        Insert: {
          branding_notes?: string | null
          cart_id: string
          configuration?: Json
          created_at?: string
          currency?: string
          id?: string
          product_variant_id: string
          quantity: number
          unit_price_cents: number
          updated_at?: string
        }
        Update: {
          branding_notes?: string | null
          cart_id?: string
          configuration?: Json
          created_at?: string
          currency?: string
          id?: string
          product_variant_id?: string
          quantity?: number
          unit_price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      carts: {
        Row: {
          company_id: string | null
          created_at: string
          currency: string
          id: string
          session_key: string | null
          status: Database["public"]["Enums"]["cart_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          session_key?: string | null
          status?: Database["public"]["Enums"]["cart_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          currency?: string
          id?: string
          session_key?: string | null
          status?: Database["public"]["Enums"]["cart_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["category_id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          email: string | null
          id: string
          legal_name: string
          phone: string | null
          registration_number: string | null
          trading_name: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          legal_name: string
          phone?: string | null
          registration_number?: string | null
          trading_name?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          legal_name?: string
          phone?: string | null
          registration_number?: string | null
          trading_name?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
      }
      company_members: {
        Row: {
          company_id: string
          created_at: string
          role: Database["public"]["Enums"]["company_member_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          role?: Database["public"]["Enums"]["company_member_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          role?: Database["public"]["Enums"]["company_member_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string
          description: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          ends_at: string | null
          id: string
          max_discount_cents: number | null
          min_subtotal_cents: number | null
          name: string
          per_customer_limit: number | null
          starts_at: string | null
          status: Database["public"]["Enums"]["discount_status"]
          updated_at: string
          usage_count: number
          usage_limit: number | null
          value_bps: number | null
          value_cents: number | null
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          discount_type: Database["public"]["Enums"]["discount_type"]
          ends_at?: string | null
          id?: string
          max_discount_cents?: number | null
          min_subtotal_cents?: number | null
          name: string
          per_customer_limit?: number | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["discount_status"]
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          value_bps?: number | null
          value_cents?: number | null
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          discount_type?: Database["public"]["Enums"]["discount_type"]
          ends_at?: string | null
          id?: string
          max_discount_cents?: number | null
          min_subtotal_cents?: number | null
          name?: string
          per_customer_limit?: number | null
          starts_at?: string | null
          status?: Database["public"]["Enums"]["discount_status"]
          updated_at?: string
          usage_count?: number
          usage_limit?: number | null
          value_bps?: number | null
          value_cents?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          branding_notes: string | null
          configuration: Json
          created_at: string
          description: string
          id: string
          order_id: string
          pricing_snapshot: Json
          product_variant_id: string | null
          quantity: number
          supplier_sku_snapshot: string | null
          tax_cents: number
          total_cents: number
          unit_cost_cents: number | null
          unit_price_cents: number
        }
        Insert: {
          branding_notes?: string | null
          configuration?: Json
          created_at?: string
          description: string
          id?: string
          order_id: string
          pricing_snapshot?: Json
          product_variant_id?: string | null
          quantity: number
          supplier_sku_snapshot?: string | null
          tax_cents?: number
          total_cents: number
          unit_cost_cents?: number | null
          unit_price_cents: number
        }
        Update: {
          branding_notes?: string | null
          configuration?: Json
          created_at?: string
          description?: string
          id?: string
          order_id?: string
          pricing_snapshot?: Json
          product_variant_id?: string | null
          quantity?: number
          supplier_sku_snapshot?: string | null
          tax_cents?: number
          total_cents?: number
          unit_cost_cents?: number | null
          unit_price_cents?: number
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
            foreignKeyName: "order_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          actor_user_id: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["order_status"] | null
          id: string
          metadata: Json
          order_id: string
          reason: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          actor_user_id?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          metadata?: Json
          order_id: string
          reason?: string | null
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          actor_user_id?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          metadata?: Json
          order_id?: string
          reason?: string | null
          to_status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          accepted_quote_snapshot: Json | null
          billing_address_snapshot: Json | null
          company_id: string | null
          created_at: string
          currency: string
          customer_notes: string | null
          discount_cents: number
          id: string
          internal_notes: string | null
          order_number: string
          pricing_snapshot: Json
          quote_id: string | null
          shipping_address_snapshot: Json | null
          shipping_cents: number
          shipping_method_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accepted_quote_snapshot?: Json | null
          billing_address_snapshot?: Json | null
          company_id?: string | null
          created_at?: string
          currency?: string
          customer_notes?: string | null
          discount_cents?: number
          id?: string
          internal_notes?: string | null
          order_number: string
          pricing_snapshot?: Json
          quote_id?: string | null
          shipping_address_snapshot?: Json | null
          shipping_cents?: number
          shipping_method_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accepted_quote_snapshot?: Json | null
          billing_address_snapshot?: Json | null
          company_id?: string | null
          created_at?: string
          currency?: string
          customer_notes?: string | null
          discount_cents?: number
          id?: string
          internal_notes?: string | null
          order_number?: string
          pricing_snapshot?: Json
          quote_id?: string | null
          shipping_address_snapshot?: Json | null
          shipping_cents?: number
          shipping_method_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_shipping_method_id_fkey"
            columns: ["shipping_method_id"]
            isOneToOne: false
            referencedRelation: "shipping_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          metadata: Json
          order_id: string
          provider: Database["public"]["Enums"]["payment_provider"]
          provider_event_reference: string | null
          provider_reference: string | null
          refund_amount_cents: number
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          metadata?: Json
          order_id: string
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_event_reference?: string | null
          provider_reference?: string | null
          refund_amount_cents?: number
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          metadata?: Json
          order_id?: string
          provider?: Database["public"]["Enums"]["payment_provider"]
          provider_event_reference?: string | null
          provider_reference?: string | null
          refund_amount_cents?: number
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      price_publications: {
        Row: {
          approved_at: string | null
          created_at: string
          currency: string
          effective_from: string
          effective_until: string | null
          id: string
          price_cents: number
          pricing_rule_id: string | null
          product_variant_id: string
          status: Database["public"]["Enums"]["price_status"]
          supplier_cost_id: string | null
          tax_treatment: Database["public"]["Enums"]["tax_treatment"]
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          currency?: string
          effective_from: string
          effective_until?: string | null
          id?: string
          price_cents: number
          pricing_rule_id?: string | null
          product_variant_id: string
          status?: Database["public"]["Enums"]["price_status"]
          supplier_cost_id?: string | null
          tax_treatment?: Database["public"]["Enums"]["tax_treatment"]
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          currency?: string
          effective_from?: string
          effective_until?: string | null
          id?: string
          price_cents?: number
          pricing_rule_id?: string | null
          product_variant_id?: string
          status?: Database["public"]["Enums"]["price_status"]
          supplier_cost_id?: string | null
          tax_treatment?: Database["public"]["Enums"]["tax_treatment"]
        }
        Relationships: [
          {
            foreignKeyName: "price_publications_pricing_rule_id_fkey"
            columns: ["pricing_rule_id"]
            isOneToOne: false
            referencedRelation: "pricing_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_publications_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_publications_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "price_publications_supplier_cost_id_fkey"
            columns: ["supplier_cost_id"]
            isOneToOne: false
            referencedRelation: "supplier_costs"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          priority: number
          target_margin_basis_points: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          priority?: number
          target_margin_basis_points: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          priority?: number
          target_margin_basis_points?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_features: {
        Row: {
          feature: string
          id: string
          product_id: string
          sort_order: number
        }
        Insert: {
          feature: string
          id?: string
          product_id: string
          sort_order?: number
        }
        Update: {
          feature?: string
          id?: string
          product_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_features_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["product_id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          approved: boolean
          created_at: string
          external_url: string | null
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          storage_path: string | null
          variant_id: string | null
        }
        Insert: {
          alt_text?: string | null
          approved?: boolean
          created_at?: string
          external_url?: string | null
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          storage_path?: string | null
          variant_id?: string | null
        }
        Update: {
          alt_text?: string | null
          approved?: boolean
          created_at?: string
          external_url?: string | null
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          storage_path?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_images_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["variant_id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          name: string
          product_id: string
          sku: string | null
          slug: string
          specifications: Json
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          product_id: string
          sku?: string | null
          slug: string
          specifications?: Json
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          product_id?: string
          sku?: string | null
          slug?: string
          specifications?: Json
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
          weight_grams?: number | null
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
            referencedRelation: "public_catalogue"
            referencedColumns: ["product_id"]
          },
        ]
      }
      products: {
        Row: {
          branding_supported: boolean
          category_id: string | null
          configurable: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          updated_at: string
        }
        Insert: {
          branding_supported?: boolean
          category_id?: string | null
          configurable?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Update: {
          branding_supported?: boolean
          category_id?: string | null
          configurable?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["category_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      proofs: {
        Row: {
          artwork_file_id: string | null
          bucket_id: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          order_id: string
          status: Database["public"]["Enums"]["proof_status"]
          storage_path: string
          updated_at: string
          version: number
        }
        Insert: {
          artwork_file_id?: string | null
          bucket_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status?: Database["public"]["Enums"]["proof_status"]
          storage_path: string
          updated_at?: string
          version?: number
        }
        Update: {
          artwork_file_id?: string | null
          bucket_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["proof_status"]
          storage_path?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "proofs_artwork_file_id_fkey"
            columns: ["artwork_file_id"]
            isOneToOne: false
            referencedRelation: "artwork_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proofs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_items: {
        Row: {
          configuration: Json
          created_at: string
          description: string
          id: string
          product_variant_id: string | null
          quantity: number
          quote_id: string
          tax_cents: number
          total_cents: number
          unit_price_cents: number
        }
        Insert: {
          configuration?: Json
          created_at?: string
          description: string
          id?: string
          product_variant_id?: string | null
          quantity: number
          quote_id: string
          tax_cents?: number
          total_cents: number
          unit_price_cents: number
        }
        Update: {
          configuration?: Json
          created_at?: string
          description?: string
          id?: string
          product_variant_id?: string | null
          quantity?: number
          quote_id?: string
          tax_cents?: number
          total_cents?: number
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          accepted_at: string | null
          company_id: string | null
          converted_order_id: string | null
          created_at: string
          currency: string
          customer_notes: string | null
          id: string
          internal_notes: string | null
          quote_number: string
          status: Database["public"]["Enums"]["quote_status"]
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          updated_at: string
          user_id: string | null
          valid_until: string | null
        }
        Insert: {
          accepted_at?: string | null
          company_id?: string | null
          converted_order_id?: string | null
          created_at?: string
          currency?: string
          customer_notes?: string | null
          id?: string
          internal_notes?: string | null
          quote_number: string
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
          user_id?: string | null
          valid_until?: string | null
        }
        Update: {
          accepted_at?: string | null
          company_id?: string | null
          converted_order_id?: string | null
          created_at?: string
          currency?: string
          customer_notes?: string | null
          id?: string
          internal_notes?: string | null
          quote_number?: string
          status?: Database["public"]["Enums"]["quote_status"]
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          updated_at?: string
          user_id?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_converted_order_fk"
            columns: ["converted_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_options: {
        Row: {
          active: boolean
          bundle_id: string | null
          description: string | null
          id: string
          max_quantity: number | null
          metadata: Json
          min_quantity: number
          name: string
          option_type: Database["public"]["Enums"]["setup_option_type"]
          product_variant_id: string | null
          selection_mode: Database["public"]["Enums"]["setup_selection_mode"]
          setup_step_id: string
          slug: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          bundle_id?: string | null
          description?: string | null
          id?: string
          max_quantity?: number | null
          metadata?: Json
          min_quantity?: number
          name: string
          option_type: Database["public"]["Enums"]["setup_option_type"]
          product_variant_id?: string | null
          selection_mode?: Database["public"]["Enums"]["setup_selection_mode"]
          setup_step_id: string
          slug: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          bundle_id?: string | null
          description?: string | null
          id?: string
          max_quantity?: number | null
          metadata?: Json
          min_quantity?: number
          name?: string
          option_type?: Database["public"]["Enums"]["setup_option_type"]
          product_variant_id?: string | null
          selection_mode?: Database["public"]["Enums"]["setup_selection_mode"]
          setup_step_id?: string
          slug?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "setup_options_bundle_id_fkey"
            columns: ["bundle_id"]
            isOneToOne: false
            referencedRelation: "bundles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setup_options_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setup_options_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "setup_options_setup_step_id_fkey"
            columns: ["setup_step_id"]
            isOneToOne: false
            referencedRelation: "setup_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_rules: {
        Row: {
          active: boolean
          id: string
          message: string | null
          rule_type: string
          setup_type_id: string
          source_option_id: string
          target_option_id: string
        }
        Insert: {
          active?: boolean
          id?: string
          message?: string | null
          rule_type: string
          setup_type_id: string
          source_option_id: string
          target_option_id: string
        }
        Update: {
          active?: boolean
          id?: string
          message?: string | null
          rule_type?: string
          setup_type_id?: string
          source_option_id?: string
          target_option_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "setup_rules_setup_type_id_fkey"
            columns: ["setup_type_id"]
            isOneToOne: false
            referencedRelation: "setup_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setup_rules_source_option_id_fkey"
            columns: ["source_option_id"]
            isOneToOne: false
            referencedRelation: "setup_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "setup_rules_target_option_id_fkey"
            columns: ["target_option_id"]
            isOneToOne: false
            referencedRelation: "setup_options"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_steps: {
        Row: {
          active: boolean
          description: string | null
          id: string
          name: string
          required: boolean
          setup_type_id: string
          slug: string
          step_order: number
        }
        Insert: {
          active?: boolean
          description?: string | null
          id?: string
          name: string
          required?: boolean
          setup_type_id: string
          slug: string
          step_order: number
        }
        Update: {
          active?: boolean
          description?: string | null
          id?: string
          name?: string
          required?: boolean
          setup_type_id?: string
          slug?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "setup_steps_setup_type_id_fkey"
            columns: ["setup_type_id"]
            isOneToOne: false
            referencedRelation: "setup_types"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_types: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      shipments: {
        Row: {
          carrier: string | null
          created_at: string
          delivered_at: string | null
          id: string
          metadata: Json
          order_id: string
          shipped_at: string | null
          shipping_method_id: string | null
          status: string
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          carrier?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          metadata?: Json
          order_id: string
          shipped_at?: string | null
          shipping_method_id?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          carrier?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          metadata?: Json
          order_id?: string
          shipped_at?: string | null
          shipping_method_id?: string | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_shipping_method_id_fkey"
            columns: ["shipping_method_id"]
            isOneToOne: false
            referencedRelation: "shipping_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_methods: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          id: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["shipping_method_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["shipping_method_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["shipping_method_status"]
          updated_at?: string
        }
        Relationships: []
      }
      shipping_rules: {
        Row: {
          active_from: string
          active_until: string | null
          created_at: string
          flat_rate_cents: number
          free_shipping: boolean
          id: string
          max_subtotal_cents: number | null
          min_subtotal_cents: number | null
          name: string
          priority: number
          shipping_method_id: string
          status: Database["public"]["Enums"]["shipping_rule_status"]
          updated_at: string
        }
        Insert: {
          active_from?: string
          active_until?: string | null
          created_at?: string
          flat_rate_cents?: number
          free_shipping?: boolean
          id?: string
          max_subtotal_cents?: number | null
          min_subtotal_cents?: number | null
          name: string
          priority?: number
          shipping_method_id: string
          status?: Database["public"]["Enums"]["shipping_rule_status"]
          updated_at?: string
        }
        Update: {
          active_from?: string
          active_until?: string | null
          created_at?: string
          flat_rate_cents?: number
          free_shipping?: boolean
          id?: string
          max_subtotal_cents?: number | null
          min_subtotal_cents?: number | null
          name?: string
          priority?: number
          shipping_method_id?: string
          status?: Database["public"]["Enums"]["shipping_rule_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_rules_shipping_method_id_fkey"
            columns: ["shipping_method_id"]
            isOneToOne: false
            referencedRelation: "shipping_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_costs: {
        Row: {
          cost_cents: number
          created_at: string
          currency: string
          id: string
          product_variant_id: string | null
          source_description: string | null
          supplier_id: string
          supplier_price_version_id: string
          supplier_sku: string
          supplier_tax_treatment: Database["public"]["Enums"]["tax_treatment"]
        }
        Insert: {
          cost_cents: number
          created_at?: string
          currency?: string
          id?: string
          product_variant_id?: string | null
          source_description?: string | null
          supplier_id: string
          supplier_price_version_id: string
          supplier_sku: string
          supplier_tax_treatment?: Database["public"]["Enums"]["tax_treatment"]
        }
        Update: {
          cost_cents?: number
          created_at?: string
          currency?: string
          id?: string
          product_variant_id?: string | null
          source_description?: string | null
          supplier_id?: string
          supplier_price_version_id?: string
          supplier_sku?: string
          supplier_tax_treatment?: Database["public"]["Enums"]["tax_treatment"]
        }
        Relationships: [
          {
            foreignKeyName: "supplier_costs_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_costs_product_variant_id_fkey"
            columns: ["product_variant_id"]
            isOneToOne: false
            referencedRelation: "public_catalogue"
            referencedColumns: ["variant_id"]
          },
          {
            foreignKeyName: "supplier_costs_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplier_costs_supplier_price_version_id_fkey"
            columns: ["supplier_price_version_id"]
            isOneToOne: false
            referencedRelation: "supplier_price_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      supplier_price_versions: {
        Row: {
          created_at: string
          effective_from: string
          effective_until: string | null
          id: string
          label: string
          source_note: string | null
          status: Database["public"]["Enums"]["price_status"]
          supplier_id: string
        }
        Insert: {
          created_at?: string
          effective_from: string
          effective_until?: string | null
          id?: string
          label: string
          source_note?: string | null
          status?: Database["public"]["Enums"]["price_status"]
          supplier_id: string
        }
        Update: {
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          id?: string
          label?: string
          source_note?: string | null
          status?: Database["public"]["Enums"]["price_status"]
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_price_versions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      tax_policies: {
        Row: {
          approved_at: string | null
          created_at: string
          effective_from: string
          effective_until: string | null
          id: string
          jurisdiction: string
          rate_basis_points: number
          source_note: string | null
          status: Database["public"]["Enums"]["price_status"]
          tax_code: string
          tax_name: string
          treatment: Database["public"]["Enums"]["tax_treatment"]
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          effective_from: string
          effective_until?: string | null
          id?: string
          jurisdiction?: string
          rate_basis_points: number
          source_note?: string | null
          status?: Database["public"]["Enums"]["price_status"]
          tax_code: string
          tax_name: string
          treatment?: Database["public"]["Enums"]["tax_treatment"]
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          effective_from?: string
          effective_until?: string | null
          id?: string
          jurisdiction?: string
          rate_basis_points?: number
          source_note?: string | null
          status?: Database["public"]["Enums"]["price_status"]
          tax_code?: string
          tax_name?: string
          treatment?: Database["public"]["Enums"]["tax_treatment"]
        }
        Relationships: []
      }
    }
    Views: {
      public_catalogue: {
        Row: {
          category_active: boolean | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          currency: string | null
          description: string | null
          effective_from: string | null
          effective_until: string | null
          price_cents: number | null
          product_id: string | null
          product_name: string | null
          product_slug: string | null
          short_description: string | null
          tax_treatment: Database["public"]["Enums"]["tax_treatment"] | null
          variant_id: string | null
          variant_name: string | null
          variant_slug: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_discount_cents: {
        Args: { p_code: string; p_subtotal_cents: number }
        Returns: number
      }
      calculate_shipping_cents: {
        Args: { p_method_slug: string; p_subtotal_cents: number }
        Returns: number
      }
      calculate_tax_cents: {
        Args: {
          p_amount_cents: number
          p_tax_rate_bps: number
          p_tax_treatment: Database["public"]["Enums"]["tax_treatment"]
        }
        Returns: number
      }
      convert_accepted_quote_to_order: {
        Args: { p_quote_id: string; p_shipping_method_slug?: string }
        Returns: {
          order_id: string
          order_number: string
          total_cents: number
        }[]
      }
      get_current_variant_price: {
        Args: { p_variant_id: string }
        Returns: {
          currency: string
          effective_from: string
          effective_until: string
          price_cents: number
          tax_rate_bps: number
          tax_treatment: Database["public"]["Enums"]["tax_treatment"]
          variant_id: string
        }[]
      }
      next_order_number: { Args: never; Returns: string }
      next_quote_number: { Args: never; Returns: string }
      prepare_checkout:
        | {
            Args: {
              p_billing_address_id?: string
              p_cart_id: string
              p_customer_notes?: string
              p_shipping_address_id?: string
            }
            Returns: {
              amount_cents: number
              currency: string
              order_id: string
              order_number: string
              payment_id: string
              status: Database["public"]["Enums"]["order_status"]
            }[]
          }
        | {
            Args: {
              p_billing_address_id?: string
              p_cart_id: string
              p_customer_notes?: string
              p_shipping_address_id?: string
              p_shipping_method_slug?: string
            }
            Returns: {
              amount_cents: number
              currency: string
              order_id: string
              order_number: string
              payment_id: string
              status: Database["public"]["Enums"]["order_status"]
            }[]
          }
        | {
            Args: {
              p_billing_address_id?: string
              p_cart_id: string
              p_customer_notes?: string
              p_discount_code?: string
              p_shipping_address_id?: string
              p_shipping_method_slug?: string
            }
            Returns: {
              amount_cents: number
              currency: string
              order_id: string
              order_number: string
              payment_id: string
              status: Database["public"]["Enums"]["order_status"]
            }[]
          }
      record_audit: {
        Args: {
          p_action: string
          p_after?: Json
          p_before?: Json
          p_entity_id: string
          p_entity_type: string
          p_metadata?: Json
        }
        Returns: string
      }
      resolve_bundle_price: {
        Args: { p_bundle_id: string }
        Returns: {
          bundle_id: string
          bundle_name: string
          currency: string
          price_cents: number
          price_mode: string
          tax_cents: number
          total_cents: number
        }[]
      }
      transition_order: {
        Args: {
          p_metadata?: Json
          p_order_id: string
          p_reason?: string
          p_to_status: Database["public"]["Enums"]["order_status"]
        }
        Returns: Database["public"]["Enums"]["order_status"]
      }
    }
    Enums: {
      address_type: "BILLING" | "SHIPPING" | "OTHER"
      artwork_review_status:
        | "PENDING"
        | "APPROVED"
        | "CHANGES_REQUESTED"
        | "REJECTED"
      artwork_source: "ORDER" | "QUOTE"
      artwork_status:
        | "UPLOADED"
        | "UNDER_REVIEW"
        | "PROOF_READY"
        | "CUSTOMER_APPROVAL"
        | "APPROVED"
        | "REJECTED"
        | "SUPERSEDED"
      bundle_status: "DRAFT" | "ACTIVE" | "ARCHIVED"
      cart_status: "ACTIVE" | "ABANDONED" | "CONVERTED"
      company_member_role: "OWNER" | "ADMIN" | "MEMBER"
      discount_status: "DRAFT" | "ACTIVE" | "ARCHIVED"
      discount_type: "PERCENT" | "FIXED"
      order_status:
        | "DRAFT"
        | "PENDING_PAYMENT"
        | "PAID"
        | "ARTWORK_REQUIRED"
        | "ARTWORK_REVIEW"
        | "PROOF_SENT"
        | "AWAITING_APPROVAL"
        | "APPROVED"
        | "PRODUCTION"
        | "READY"
        | "DISPATCHED"
        | "DELIVERED"
        | "CANCELLED"
        | "REFUND_PENDING"
        | "REFUNDED"
      payment_provider: "YOCO" | "MANUAL" | "OTHER"
      payment_status:
        | "INITIATED"
        | "PENDING"
        | "VERIFIED"
        | "FAILED"
        | "EXPIRED"
        | "CANCELLED"
        | "REFUND_PENDING"
        | "REFUNDED"
        | "PARTIALLY_REFUNDED"
        | "DISPUTED"
      price_status: "DRAFT" | "PUBLISHED" | "EXPIRED"
      product_status: "DRAFT" | "ACTIVE" | "ARCHIVED"
      proof_status:
        | "DRAFT"
        | "SENT"
        | "APPROVED"
        | "CHANGES_REQUESTED"
        | "REJECTED"
        | "SUPERSEDED"
      quote_status:
        | "DRAFT"
        | "SENT"
        | "ACCEPTED"
        | "REJECTED"
        | "EXPIRED"
        | "CONVERTED"
        | "CANCELLED"
      setup_option_type: "PRODUCT" | "BUNDLE" | "INFORMATIONAL"
      setup_selection_mode: "SINGLE" | "MULTIPLE" | "QUANTITY"
      shipping_method_status: "DRAFT" | "ACTIVE" | "ARCHIVED"
      shipping_rule_status: "DRAFT" | "ACTIVE" | "ARCHIVED"
      tax_treatment: "TAXABLE" | "ZERO_RATED" | "EXEMPT" | "OUT_OF_SCOPE"
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
      address_type: ["BILLING", "SHIPPING", "OTHER"],
      artwork_review_status: [
        "PENDING",
        "APPROVED",
        "CHANGES_REQUESTED",
        "REJECTED",
      ],
      artwork_source: ["ORDER", "QUOTE"],
      artwork_status: [
        "UPLOADED",
        "UNDER_REVIEW",
        "PROOF_READY",
        "CUSTOMER_APPROVAL",
        "APPROVED",
        "REJECTED",
        "SUPERSEDED",
      ],
      bundle_status: ["DRAFT", "ACTIVE", "ARCHIVED"],
      cart_status: ["ACTIVE", "ABANDONED", "CONVERTED"],
      company_member_role: ["OWNER", "ADMIN", "MEMBER"],
      discount_status: ["DRAFT", "ACTIVE", "ARCHIVED"],
      discount_type: ["PERCENT", "FIXED"],
      order_status: [
        "DRAFT",
        "PENDING_PAYMENT",
        "PAID",
        "ARTWORK_REQUIRED",
        "ARTWORK_REVIEW",
        "PROOF_SENT",
        "AWAITING_APPROVAL",
        "APPROVED",
        "PRODUCTION",
        "READY",
        "DISPATCHED",
        "DELIVERED",
        "CANCELLED",
        "REFUND_PENDING",
        "REFUNDED",
      ],
      payment_provider: ["YOCO", "MANUAL", "OTHER"],
      payment_status: [
        "INITIATED",
        "PENDING",
        "VERIFIED",
        "FAILED",
        "EXPIRED",
        "CANCELLED",
        "REFUND_PENDING",
        "REFUNDED",
        "PARTIALLY_REFUNDED",
        "DISPUTED",
      ],
      price_status: ["DRAFT", "PUBLISHED", "EXPIRED"],
      product_status: ["DRAFT", "ACTIVE", "ARCHIVED"],
      proof_status: [
        "DRAFT",
        "SENT",
        "APPROVED",
        "CHANGES_REQUESTED",
        "REJECTED",
        "SUPERSEDED",
      ],
      quote_status: [
        "DRAFT",
        "SENT",
        "ACCEPTED",
        "REJECTED",
        "EXPIRED",
        "CONVERTED",
        "CANCELLED",
      ],
      setup_option_type: ["PRODUCT", "BUNDLE", "INFORMATIONAL"],
      setup_selection_mode: ["SINGLE", "MULTIPLE", "QUANTITY"],
      shipping_method_status: ["DRAFT", "ACTIVE", "ARCHIVED"],
      shipping_rule_status: ["DRAFT", "ACTIVE", "ARCHIVED"],
      tax_treatment: ["TAXABLE", "ZERO_RATED", "EXEMPT", "OUT_OF_SCOPE"],
    },
  },
} as const
