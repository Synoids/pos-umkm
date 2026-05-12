"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/providers/auth-provider"
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart,
  AlertCircle,
  ArrowRight,
  PlusIcon
} from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function DashboardOverview() {
  const { user } = useAuth()

  // Fetch summary data
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.organization_id],
    queryFn: async () => {
      const supabase = createClient()
      
      // Get today's sales
      const startOfToday = new Date()
      startOfToday.setHours(0, 0, 0, 0)
      
      const { data: sales } = await supabase
        .from('transactions')
        .select('total_amount')
        .eq('organization_id', user?.organization_id)
        .gte('created_at', startOfToday.toISOString())

      const totalRevenue = sales?.reduce((acc, curr) => acc + curr.total_amount, 0) || 0
      const transactionCount = sales?.length || 0

      // Get low stock count
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', user?.organization_id)
        .lt('stock', 10)
        .is('deleted_at', null)

      // Get total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', user?.organization_id)
        .is('deleted_at', null)

      return {
        revenue: totalRevenue,
        transactions: transactionCount,
        lowStock: lowStockCount || 0,
        totalProducts: totalProducts || 0
      }
    },
    enabled: !!user?.organization_id
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="grid gap-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-md bg-primary text-primary-foreground">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary-foreground/70 font-medium">Daily Revenue</CardDescription>
            <CardTitle className="text-3xl font-black">{formatCurrency(stats?.revenue || 0)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs font-bold bg-white/10 w-fit px-2 py-1 rounded-full">
              <TrendingUp className="size-3" />
              +12.5% from yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Total Transactions</CardDescription>
            <CardTitle className="text-3xl font-black">{stats?.transactions || 0}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <ShoppingCart className="size-3" />
              Today's sales volume
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Low Stock Items</CardDescription>
            <CardTitle className={cn("text-3xl font-black", (stats?.lowStock || 0) > 0 ? "text-destructive" : "")}>
              {stats?.lowStock || 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <AlertCircle className="size-3" />
              Items needing restock
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardDescription className="font-medium">Inventory Value</CardDescription>
            <CardTitle className="text-3xl font-black">{stats?.totalProducts || 0}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Package className="size-3" />
              Active SKUs
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common operations at your fingertips.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild className="h-12 justify-between group" variant="outline">
              <Link href="/dashboard/pos">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="size-4 text-primary" />
                  <span>Open Cashier (POS)</span>
                </div>
                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
            </Button>
            <Button asChild className="h-12 justify-between group" variant="outline">
              <Link href="/dashboard/inventory/products">
                <div className="flex items-center gap-3">
                  <PlusIcon className="size-4 text-green-600" />
                  <span>Add New Product</span>
                </div>
                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
            </Button>
            <Button asChild className="h-12 justify-between group" variant="outline">
              <Link href="/dashboard/inventory/history">
                <div className="flex items-center gap-3">
                  <HistoryIcon className="size-4 text-blue-600" />
                  <span>Audit History</span>
                </div>
                <ArrowRight className="size-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Business Health / Welcome Area */}
        <Card className="lg:col-span-2 border-none shadow-sm bg-muted/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <TrendingUp className="size-40" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg">Business Health</CardTitle>
            <CardDescription>Your operational performance is looking solid.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6 py-4">
              <div className="flex flex-col gap-2">
                 <div className="flex justify-between items-end">
                    <span className="text-sm font-medium">Daily Target</span>
                    <span className="text-xs text-muted-foreground">75% Achieved</span>
                 </div>
                 <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[75%] rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                 </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-background/50 border">
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Top Performer</p>
                   <p className="font-bold">Kopi Susu Gula Aren</p>
                   <p className="text-[10px] text-primary">124 units sold</p>
                </div>
                <div className="p-4 rounded-xl bg-background/50 border">
                   <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Peak Hour</p>
                   <p className="font-bold">14:00 - 16:00</p>
                   <p className="text-[10px] text-primary">Highest traffic</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Internal icons needed
function HistoryIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
