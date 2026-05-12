"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  AlertTriangle,
  HistoryIcon,
  SearchIcon,
  FilterIcon
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function InventoryHistoryContainer() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const { data: movements, isLoading } = useQuery({
    queryKey: ['inventory-history', user?.organization_id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('stock_movements')
        .select(`
          *,
          products (name, sku),
          inventory_reasons (label, category),
          profiles (full_name)
        `)
        .eq('organization_id', user?.organization_id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    },
    enabled: !!user?.organization_id
  })

  const filteredMovements = movements?.filter(m => 
    m.products?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.products?.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'INBOUND': return <ArrowDownLeft className="size-3 text-green-600" />
      case 'OUTBOUND': return <ArrowUpRight className="size-3 text-red-600" />
      case 'ADJUSTMENT': return <RefreshCw className="size-3 text-blue-600" />
      default: return <HistoryIcon className="size-3" />
    }
  }

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'INBOUND': return "bg-green-50 text-green-700 border-green-200"
      case 'OUTBOUND': return "bg-red-50 text-red-700 border-red-200"
      case 'ADJUSTMENT': return "bg-blue-50 text-blue-700 border-blue-200"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input 
            placeholder="Filter by product name or SKU..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="h-9 px-3 gap-1.5 font-normal">
              <FilterIcon className="size-3.5" />
              All Categories
           </Badge>
        </div>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Source</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={6} className="h-16 bg-muted/10" />
                </TableRow>
              ))
            ) : filteredMovements?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  No activity history found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMovements?.map((m) => (
                <TableRow key={m.id} className="group hover:bg-muted/20">
                  <TableCell className="whitespace-nowrap text-xs font-medium">
                    {format(new Date(m.created_at), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{m.products?.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">{m.products?.sku || 'NO-SKU'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("gap-1.5 font-medium border shadow-none", getCategoryBadge(m.inventory_reasons?.category))}>
                      {getCategoryIcon(m.inventory_reasons?.category)}
                      {m.inventory_reasons?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold">
                    <span className={m.delta_quantity > 0 ? "text-green-600" : "text-red-600"}>
                      {m.delta_quantity > 0 ? '+' : ''}{m.delta_quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    {m.profiles?.full_name || "System Agent"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-tighter">
                      {m.source}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
