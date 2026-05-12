import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database.types"

export type TransactionStatus = Database['public']['Enums']['transaction_status']
export type PaymentMethod = Database['public']['Enums']['payment_method']

export interface CartItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export const posService = {
  /**
   * Process a POS Transaction atomically via RPC
   * This handles locking, stock validation, and ledger entries in one DB transaction.
   */
  async processTransaction(params: {
    operationId: string
    items: CartItem[]
    paymentMethod: PaymentMethod
    auditContext?: any
  }) {
    const supabase = createClient()

    // We call the hardened version (v4) of the RPC
    const { data, error } = await supabase.rpc('process_pos_transaction_v4', {
      p_operation_id: params.operationId,
      p_items: params.items.map(item => ({
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: item.price
      })),
      p_payment_method: params.paymentMethod,
      p_audit_context: params.auditContext || {}
    })

    if (error) {
      // Handle specific error codes from the RPC (e.g., OUT_OF_STOCK)
      if (error.message.includes('INSUFFICIENT_STOCK')) {
        throw new Error("One or more items are out of stock.")
      }
      if (error.message.includes('duplicate key')) {
        throw new Error("This transaction has already been processed.")
      }
      throw error
    }

    return data // Returns the transaction ID
  },

  /**
   * Get transaction history for an organization
   */
  async getTransactionHistory(orgId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        profiles (full_name),
        transaction_items (
          *,
          products (name)
        )
      `)
      .eq('organization_id', orgId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  /**
   * Refund a transaction
   */
  async refundTransaction(transactionId: string, userId: string) {
    const supabase = createClient()

    // Call RPC for atomic refund (updates status and records movements)
    const { data, error } = await supabase.rpc('refund_pos_transaction', {
      p_transaction_id: transactionId,
      p_profile_id: userId
    })

    if (error) throw error
    return data
  }
}
