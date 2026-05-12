import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database.types"

const demoProducts = [
  { name: "Caramel Macchiato", category: "Coffee", price: 35000, stock: 50 },
  { name: "Iced Americano", category: "Coffee", price: 25000, stock: 100 },
  { name: "Matcha Latte", category: "Non-Coffee", price: 32000, stock: 40 },
  { name: "Almond Croissant", category: "Pastry", price: 28000, stock: 15 },
  { name: "Red Velvet Cake", category: "Cake", price: 45000, stock: 10 },
]

export const seedService = {
  async seedOrganizationData(orgId: string, userId: string) {
    const supabase = createClient()
    
    // 1. Seed Products
    const { data: products, error: productError } = await (supabase as any)
      .from('products')
      .insert(demoProducts.map(p => ({
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        organization_id: orgId
      })))
      .select()
    
    if (productError || !products) throw productError || new Error("Failed to seed products")

    // 2. Seed Transactions (Last 7 days)
    for (let i = 0; i < 50; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      const quantity = Math.floor(Math.random() * 3) + 1
      const totalAmount = randomProduct.price * quantity
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 7))

      const { data: tx, error: txError } = await (supabase as any)
        .from('transactions')
        .insert({
          organization_id: orgId,
          profile_id: userId,
          total_amount: totalAmount,
          payment_method: ['cash', 'qris', 'debit'][Math.floor(Math.random() * 3)] as any,
          status: 'completed',
          created_at: date.toISOString()
        })
        .select()
        .single()

      if (txError || !tx) continue

      await (supabase as any).from('transaction_items').insert({
        transaction_id: tx.id,
        product_id: randomProduct.id,
        quantity,
        unit_price: randomProduct.price,
        total_price: totalAmount
      })
    }

    return { success: true }
  }
}
