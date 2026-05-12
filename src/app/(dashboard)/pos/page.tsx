import { Metadata } from "next"
import { POSContainer } from "@/components/dashboard/pos/pos-container"

export const metadata: Metadata = {
  title: "POS - Synoids",
  description: "Point of Sale interface for fast and reliable transactions.",
}

export default function POSPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] overflow-hidden">
      <div className="flex-1 overflow-hidden p-4 md:p-6 lg:p-8">
        <POSContainer />
      </div>
    </div>
  )
}
