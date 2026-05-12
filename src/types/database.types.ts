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
      inventory_reasons: {
        Row: {
          id: string
          organization_id: string | null
          category: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT'
          code: string
          label: string
          is_system: boolean
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          category: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT'
          code: string
          label: string
          is_system?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          category?: 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT'
          code?: string
          label?: string
          is_system?: boolean
          created_at?: string
        }
      }
      stock_movements: {
        Row: {
          id: string
          organization_id: string
          product_id: string
          delta_quantity: number
          unit_cost: number | null
          reason_id: string
          source: 'POS' | 'API' | 'MARKETPLACE' | 'SYSTEM' | 'MANUAL'
          reference_id: string | null
          sequence_number: number
          metadata: Json
          created_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          organization_id: string
          product_id: string
          delta_quantity: number
          unit_cost?: number | null
          reason_id: string
          source: 'POS' | 'API' | 'MARKETPLACE' | 'SYSTEM' | 'MANUAL'
          reference_id?: string | null
          sequence_number?: number
          metadata?: Json
          created_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          organization_id?: string
          product_id?: string
          delta_quantity?: number
          unit_cost?: number | null
          reason_id?: string
          source?: 'POS' | 'API' | 'MARKETPLACE' | 'SYSTEM' | 'MANUAL'
          reference_id?: string | null
          sequence_number?: number
          metadata?: Json
          created_at?: string
          created_by?: string | null
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          organization_id: string | null
          full_name: string | null
          role: Database['public']['Enums']['user_role']
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          organization_id?: string | null
          full_name?: string | null
          role?: Database['public']['Enums']['user_role']
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          full_name?: string | null
          role?: Database['public']['Enums']['user_role']
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          organization_id: string
          name: string
          description: string | null
          price: number
          stock: number
          stock_reserved: number
          sku: string | null
          category: string | null
          image_url: string | null
          metadata: Json
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          description?: string | null
          price: number
          stock?: number
          stock_reserved?: number
          sku?: string | null
          category?: string | null
          image_url?: string | null
          metadata?: Json
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          description?: string | null
          price?: number
          stock?: number
          stock_reserved?: number
          sku?: string | null
          category?: string | null
          image_url?: string | null
          metadata?: Json
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          organization_id: string
          profile_id: string
          total_amount: number
          payment_method: Database['public']['Enums']['payment_method']
          status: Database['public']['Enums']['transaction_status']
          idempotency_key: string | null
          metadata: Json
          deleted_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          profile_id: string
          total_amount: number
          payment_method: Database['public']['Enums']['payment_method']
          status: Database['public']['Enums']['transaction_status']
          idempotency_key?: string | null
          metadata?: Json
          deleted_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          profile_id?: string
          total_amount?: number
          payment_method?: Database['public']['Enums']['payment_method']
          status?: Database['public']['Enums']['transaction_status']
          idempotency_key?: string | null
          metadata?: Json
          deleted_at?: string | null
          created_at?: string
        }
      }
      transaction_items: {
        Row: {
          id: string
          transaction_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Insert: {
          id?: string
          transaction_id: string
          product_id: string
          quantity: number
          unit_price: number
          total_price: number
        }
        Update: {
          id?: string
          transaction_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          total_price?: number
        }
      }
      audit_logs: {
        Row: {
          id: string
          organization_id: string
          profile_id: string
          action: string
          entity_type: string
          entity_id: string
          old_data: Json | null
          new_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          profile_id: string
          action: string
          entity_type: string
          entity_id: string
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          profile_id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          old_data?: Json | null
          new_data?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'owner' | 'manager' | 'cashier'
      payment_method: 'cash' | 'debit' | 'credit' | 'qris'
      transaction_status: 'pending' | 'completed' | 'cancelled' | 'refunded'
    }
  }
}
  }
}
