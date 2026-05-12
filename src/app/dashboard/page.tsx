import { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard/overview"

export const metadata: Metadata = {
  title: "Dashboard - Synoids",
  description: "Operational overview of your business performance.",
}

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, Admin</h1>
        <p className="text-muted-foreground">Here is what is happening with your business today.</p>
      </div>

      <DashboardOverview />
    </div>
  )
}
