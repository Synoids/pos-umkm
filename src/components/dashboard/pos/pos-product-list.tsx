"use client"

import { Database } from "@/types/database.types"
import { useCartStore } from "@/store/use-cart-store"
import { PlusIcon, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Product = Database['public']['Tables']['products']['Row']

interface POSProductListProps {
  products: Product[]
}

export function POSProductList({ products }: POSProductListProps) {
  const addItem = useCartStore((state) => state.addItem)

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 py-20">
        <p className="text-lg">No products found.</p>
        <p className="text-sm">Try searching for something else.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            sku: product.sku || undefined,
            image: product.image_url || undefined,
            quantity: 1
          })}
          className="group relative flex flex-col bg-card rounded-xl border p-3 text-left transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 active:scale-[0.98]"
        >
          <div className="aspect-square w-full rounded-lg bg-muted/50 overflow-hidden mb-3 flex items-center justify-center">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <ImageIcon className="size-8 text-muted-foreground/30" />
            )}
          </div>
          
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{product.name}</h3>
            <p className="text-xs text-muted-foreground truncate">{product.sku || 'No SKU'}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="font-bold text-primary">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
              </span>
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <PlusIcon className="size-4" />
              </div>
            </div>
          </div>

          {product.stock <= 5 && (
            <div className="absolute top-2 right-2 bg-destructive/10 text-destructive text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              Low Stock: {product.stock}
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
