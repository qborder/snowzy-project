import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl


  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dev/:path*'
  ]
}
