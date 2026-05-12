import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database.types"

export type InventoryReasonCategory = Database['public']['Tables']['inventory_reasons']['Row']['category']
export type MovementSource = Database['public']['Tables']['stock_movements']['Row']['source']

export const inventoryService = {
  /**
   * Get all products for an organization (respecting soft-delete)
   */
  async getProducts(orgId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('organization_id', orgId)
      .is('deleted_at', null)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  /**
   * Record a stock movement (The Ledger Entry)
   */
  async recordMovement(params: {
    organizationId: string
    productId: string
    deltaQuantity: number
    reasonCode: string
    source: MovementSource
    operationId: string // Mandatory for idempotency
    unitCost?: number
    referenceId?: string
    metadata?: any
    userId?: string
  }) {
    const supabase = createClient()

    // 1. Get the reason ID
    const { data: reason } = await supabase
      .from('inventory_reasons')
      .select('id')
      .eq('code', params.reasonCode)
      .maybeSingle()
    
    if (!reason) throw new Error(`Invalid inventory reason code: ${params.reasonCode}`)

    // 2. Insert the movement record
    const { data, error } = await supabase
      .from('stock_movements')
      .insert({
        organization_id: params.organizationId,
        product_id: params.productId,
        delta_quantity: params.deltaQuantity,
        reason_id: reason.id,
        source: params.source,
        operation_id: params.operationId,
        unit_cost_snapshot: params.unitCost,
        reference_id: params.referenceId,
        metadata: params.metadata || {},
        created_by: params.userId,
        actor_type: 'USER'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Reconcile physical stock (Physical Count Adjustment)
   */
  async reconcileStock(params: {
    organizationId: string
    productId: string
    actualQuantity: number
    userId: string
    operationId: string
    note?: string
  }) {
    const supabase = createClient()

    // 1. Get current snapshot
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', params.productId)
      .single()
    
    if (!product) throw new Error("Product not found")

    const delta = params.actualQuantity - product.stock
    if (delta === 0) return // No change needed

    // 2. Record the adjustment movement
    return this.recordMovement({
      organizationId: params.organizationId,
      productId: params.productId,
      deltaQuantity: delta,
      reasonCode: 'MANUAL_ADJUSTMENT',
      source: 'MANUAL',
      operationId: params.operationId,
      userId: params.userId,
      metadata: { note: params.note }
    })
  },

  /**
   * Get movement history for a product
   */
  async getProductHistory(productId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('stock_movements')
      .select(`
        *,
        inventory_reasons (label, category),
        profiles (full_name)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  /**
   * Rebuild the stock snapshot from historical movements (Health Check/Repair)
   */
  async rebuildSnapshot(productId: string) {
    const supabase = createClient()

    // 1. Calculate sum of all deltas
    const { data: movements, error: moveError } = await supabase
      .from('stock_movements')
      .select('delta_quantity')
      .eq('product_id', productId)
    
    if (moveError) throw moveError

    const totalStock = movements.reduce((acc, curr) => acc + curr.delta_quantity, 0)

    // 2. Update the product snapshot
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: totalStock })
      .eq('id', productId)
    
    if (updateError) throw updateError
    return totalStock
  }
}
