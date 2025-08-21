import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Block dev routes in production
  if (process.env.NODE_ENV === 'production' && pathname.startsWith('/dev')) {
    return NextResponse.redirect(new URL('/404', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dev/:path*'
  ]
}
