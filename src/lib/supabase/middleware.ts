import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/database.types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()
  const isAuthPage = url.pathname.startsWith('/login') || url.pathname.startsWith('/register')
  const isDashboardPage = url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/pos') || url.pathname.startsWith('/inventory') || url.pathname.startsWith('/transactions') || url.pathname.startsWith('/staff')
  const isOnboardingPage = url.pathname.startsWith('/onboarding')

  // If trying to access dashboard but not logged in, redirect to login
  if (isDashboardPage && !user) {
    url.pathname = '/login'
    url.searchParams.set('next', request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // If logged in and on auth page, redirect to dashboard
  if (isAuthPage && user) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // If logged in but no organization, redirect to onboarding (except if already on onboarding)
  if (user && isDashboardPage && !isOnboardingPage) {
    const { data: profile } = await (supabase as any)
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
