"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, Loader2, Rocket, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authService } from "@/services/auth-service"
import { seedService } from "@/services/seed-service"
import { toast } from "sonner"

const onboardingSchema = z.object({
  orgName: z.string().min(3, "Organization name must be at least 3 characters"),
  orgSlug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Only lowercase, numbers, and dashes allowed"),
})

export default function OnboardingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    const checkUser = async () => {
      const session = await authService.getSession()
      if (!session?.user) {
        router.push("/login")
        return
      }
      
      const u = session.user
      setUser(u)
      
      // Check if already has org
      const profile: any = await authService.getProfile(u.id)
      if (profile?.organization_id) {
        router.push("/dashboard")
      }
    }
    checkUser()
  }, [router])

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      orgName: "",
      orgSlug: "",
    },
  })

  // Sync slug with name
  const orgName = form.watch("orgName")
  React.useEffect(() => {
    if (orgName) {
      const slug = orgName
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "")
      form.setValue("orgSlug", slug)
    }
  }, [orgName, form])

  const [seedDemo, setSeedDemo] = React.useState(true)

  async function onSubmit(values: z.infer<typeof onboardingSchema>) {
    if (!user) return
    setIsLoading(true)
    try {
      const org = await authService.createOrganization(user.id, values.orgName, values.orgSlug)
      
      if (seedDemo) {
        toast.info("Generating demo infrastructure...")
        await seedService.seedOrganizationData(org.id, user.id)
      }

      toast.success("Organization created! Launching your terminal...")
      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to create organization")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,100,255,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-[500px] z-10 space-y-8 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-4">
            <Rocket className="size-3" />
            Final Step: Infrastructure Setup
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Deploy Your Organization</h1>
          <p className="text-muted-foreground">Every terminal needs a home. Create your workspace now.</p>
        </div>

        <Card className="bg-card/30 backdrop-blur-xl border-primary/20 shadow-2xl text-left">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                This will be the identity of your business across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Name</label>
                <Input
                  placeholder="e.g. Synoids Coffee & Roastery"
                  className="bg-background/50 border-primary/10"
                  {...form.register("orgName")}
                />
                {form.formState.errors.orgName && (
                  <p className="text-xs text-destructive">{form.formState.errors.orgName.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Workspace URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="my-business-slug"
                    className="bg-background/50 border-primary/10 pl-9"
                    {...form.register("orgSlug")}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic">
                  app.synoids.com/{form.watch("orgSlug") || "your-slug"}
                </p>
                {form.formState.errors.orgSlug && (
                  <p className="text-xs text-destructive">{form.formState.errors.orgSlug.message}</p>
                )}
              </div>

              <div className="pt-4 border-t border-primary/10">
                <div className="flex items-center space-x-2 bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <input
                    type="checkbox"
                    id="seed-demo"
                    checked={seedDemo}
                    onChange={(e) => setSeedDemo(e.target.checked)}
                    className="size-4 rounded border-primary/20 text-primary focus:ring-primary/50"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="seed-demo"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Pre-populate with demo data
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Start with realistic products and 7-day sales history.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create & Launch Dashboard"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-xs text-muted-foreground">
          By creating an organization, you agree to the Synoids Service Terms.
          <br />You will be assigned the <span className="text-primary font-semibold uppercase">Owner</span> role.
        </p>
      </div>
    </div>
  )
}
