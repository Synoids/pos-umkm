"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { inventoryService } from "@/services/inventory-service"
import { useAuth } from "@/hooks/use-auth"
import { POSProductList } from "./pos-product-list"
import { POSCart } from "./pos-cart"
import { Input } from "@/components/ui/input"
import { SearchIcon, Loader2 } from "lucide-react"

export function POSContainer() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', user?.organization_id],
    queryFn: () => inventoryService.getProducts(user?.organization_id as string),
    enabled: !!user?.organization_id,
  })

  const filteredProducts = products?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full overflow-hidden">
      {/* Product Selection Area */}
      <div className="lg:col-span-8 flex flex-col gap-6 overflow-hidden">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Search products by name or SKU..." 
            className="pl-10 h-12 bg-muted/30 border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary/50" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <POSProductList products={filteredProducts || []} />
          </div>
        )}
      </div>

      {/* Cart & Checkout Area */}
      <div className="lg:col-span-4 flex flex-col h-full bg-card rounded-2xl border shadow-sm overflow-hidden">
        <POSCart />
      </div>
    </div>
  )
}
