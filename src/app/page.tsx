import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,100,255,0.1),transparent_50%)] pointer-events-none" />
      
      <div className="z-10 flex flex-col items-center text-center gap-6 max-w-2xl">
        <div className="size-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_rgba(0,100,255,0.3)] mb-4">
          <Plus className="size-8 text-primary-foreground" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
          Synoids POS
        </h1>
        
        <p className="text-xl text-muted-foreground">
          The Intelligent Infrastructure for Next-Gen Commerce.
        </p>
        
        <div className="flex gap-4 mt-4">
          <Button render={<Link href="/dashboard" />} size="lg" className="px-8 rounded-full shadow-[0_0_20px_rgba(0,100,255,0.2)]">
            Enter Dashboard
          </Button>
          <Button variant="outline" size="lg" className="px-8 rounded-full">
            Documentation
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-3 gap-8 w-full border-t border-primary/10 pt-8 text-sm text-muted-foreground">
          <div>
            <div className="text-foreground font-semibold">Offline Ready</div>
            Syncs when you're back
          </div>
          <div>
            <div className="text-foreground font-semibold">AI Powered</div>
            Predictive inventory
          </div>
          <div>
            <div className="text-foreground font-semibold">Multi-tenant</div>
            Scale your business
          </div>
        </div>
      </div>
    </div>
  )
}
