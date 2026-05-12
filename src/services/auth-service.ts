import { createClient } from "@/lib/supabase/client"
import { Database } from "@/types/database.types"

export type UserRole = Database['public']['Enums']['user_role']

export interface Profile {
  id: string
  organization_id: string | null
  full_name: string | null
  role: UserRole
  created_at: string
}

export const authService = {
  async getSession() {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  async getUser() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async getProfile(userId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles' as any)
      .select('*, organizations(*)')
      .eq('id', userId)
      .single()
    
    if (error) return null
    return data as any
  },

  async signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
  },

  async createOrganization(userId: string, orgName: string, orgSlug: string) {
    const supabase = createClient()
    
    // 1. Create organization
    const { data: org, error: orgError } = await (supabase as any)
      .from('organizations')
      .insert({ name: orgName, slug: orgSlug })
      .select()
      .single()
    
    if (orgError) throw orgError

    // 2. Update profile with organization_id and owner role using UPSERT
    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .upsert({ 
        id: userId,
        organization_id: org.id,
        role: 'owner',
        updated_at: new Date().toISOString()
      })

    if (profileError) throw profileError
    
    return org
  }
}
