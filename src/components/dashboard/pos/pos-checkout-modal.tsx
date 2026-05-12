"use client"

import { useState } from "react"
import { useCartStore } from "@/store/use-cart-store"
import { posService, PaymentMethod } from "@/services/pos-service"
import { useAuth } from "@/providers/auth-provider"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  BanknoteIcon, 
  QrCodeIcon, 
  CreditCardIcon, 
  CheckCircle2Icon, 
  Loader2Icon,
  ChevronRightIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface POSCheckoutModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function POSCheckoutModal({ isOpen, onOpenChange }: POSCheckoutModalProps) {
  const { user } = useAuth()
  const { items, getTotalPrice, operationId, clearCart, resetOperationId } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [amountPaid, setAmountPaid] = useState<string>("")

  const totalPrice = getTotalPrice()
  const change = Math.max(0, (Number(amountPaid) || 0) - totalPrice)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleCheckout = async () => {
    if (!user?.organization_id) return
    
    if (paymentMethod === "cash" && (Number(amountPaid) || 0) < totalPrice) {
      toast.error("Insufficient payment amount.")
      return
    }

    setIsProcessing(true)
    try {
      await posService.processTransaction({
        operationId,
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod,
        auditContext: {
          terminal: "Web Dashboard",
          source: "POS_V1"
        }
      })

      setIsSuccess(true)
      toast.success("Transaction completed successfully!")
      
      // Delay cleaning up to show success state
      setTimeout(() => {
        clearCart()
        resetOperationId()
        setIsSuccess(false)
        onOpenChange(false)
        setAmountPaid("")
      }, 2000)
    } catch (error: any) {
      toast.error(error.message || "Failed to process transaction")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px] flex flex-col items-center justify-center py-10">
          <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 animate-bounce">
            <CheckCircle2Icon className="size-12" />
          </div>
          <h2 className="text-2xl font-bold">Success!</h2>
          <p className="text-muted-foreground text-center mt-2">
            Transaction has been recorded. <br /> Printing receipt...
          </p>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl">Complete Payment</DialogTitle>
          <DialogDescription>
            Select a payment method and finalize the order.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Total Summary */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex flex-col items-center">
            <span className="text-xs font-medium text-primary/70 uppercase tracking-widest mb-1">Amount to Pay</span>
            <span className="text-4xl font-black text-primary">{formatCurrency(totalPrice)}</span>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "cash", label: "Cash", icon: BanknoteIcon },
                { id: "qris", label: "QRIS", icon: QrCodeIcon },
                { id: "debit", label: "Debit Card", icon: CreditCardIcon },
                { id: "credit", label: "Credit Card", icon: CreditCardIcon },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all text-left",
                    paymentMethod === method.id 
                      ? "border-primary bg-primary/5 text-primary ring-1 ring-primary"
                      : "hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "size-8 rounded-lg flex items-center justify-center",
                    paymentMethod === method.id ? "bg-primary text-primary-foreground" : "bg-muted"
                  )}>
                    <method.icon className="size-4" />
                  </div>
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cash Input */}
          {paymentMethod === "cash" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <Label htmlFor="amount-paid" className="text-xs uppercase tracking-wider text-muted-foreground">Cash Received</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">Rp</span>
                  <Input 
                    id="amount-paid"
                    type="number"
                    placeholder="0"
                    className="pl-10 h-12 text-lg font-bold"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                <span className="text-sm">Change</span>
                <span className={cn(
                  "text-lg font-bold",
                  change > 0 ? "text-green-600" : "text-muted-foreground"
                )}>
                  {formatCurrency(change)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-muted/20 border-t flex gap-3">
          <Button variant="outline" className="flex-1 h-12" onClick={() => onOpenChange(false)} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            className="flex-[2] h-12 text-lg font-bold" 
            disabled={isProcessing || (paymentMethod === "cash" && !amountPaid)}
            onClick={handleCheckout}
          >
            {isProcessing ? (
              <Loader2Icon className="size-5 animate-spin mr-2" />
            ) : (
              <CheckCircle2Icon className="size-5 mr-2" />
            )}
            Complete Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
