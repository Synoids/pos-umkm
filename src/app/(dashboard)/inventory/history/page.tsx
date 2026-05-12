import { Metadata } from "next"
import { InventoryHistoryContainer } from "@/components/dashboard/inventory/history-container"

export const metadata: Metadata = {
  title: "Inventory History - Synoids",
  description: "Complete audit trail of all stock movements.",
}

export default function InventoryHistoryPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory History</h1>
        <p className="text-muted-foreground">Monitor and audit every stock movement across your organization.</p>
      </div>

      <InventoryHistoryContainer />
    </div>
  )
}
