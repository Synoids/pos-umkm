"use client"

import { useCartStore } from "@/store/use-cart-store"
import { Trash2Icon, PlusIcon, MinusIcon, ShoppingCartIcon, ReceiptIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { POSCheckoutModal } from "./pos-checkout-modal"
import { useState } from "react"

export function POSCart() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCartStore()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-muted-foreground opacity-40">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ShoppingCartIcon className="size-8" />
        </div>
        <p className="font-medium">Cart is empty</p>
        <p className="text-sm">Click on products to add them to the cart.</p>
      </div>
    )
  }

  return (
    <>
      <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ReceiptIcon className="size-4 text-primary" />
          <h2 className="font-semibold text-sm uppercase tracking-wider">Order Summary</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon-sm" 
          onClick={clearCart}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2Icon className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium truncate">{item.name}</h4>
              <p className="text-xs text-muted-foreground">{formatCurrency(item.price)}</p>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="icon-xs" 
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="size-7 rounded-lg"
              >
                <MinusIcon className="size-3" />
              </Button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <Button 
                variant="outline" 
                size="icon-xs" 
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="size-7 rounded-lg"
              >
                <PlusIcon className="size-3" />
              </Button>
            </div>

            <div className="text-right min-w-[80px]">
              <p className="text-sm font-bold">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-muted/10 border-t flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Items</span>
            <span>{getTotalItems()} items</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium">Total Amount</span>
            <span className="text-2xl font-black text-primary">{formatCurrency(getTotalPrice())}</span>
          </div>
        </div>

        <Button 
          size="lg" 
          className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
          onClick={() => setIsCheckoutOpen(true)}
        >
          Checkout Now
        </Button>
      </div>

      <POSCheckoutModal 
        isOpen={isCheckoutOpen} 
        onOpenChange={setIsCheckoutOpen} 
      />
    </>
  )
}
