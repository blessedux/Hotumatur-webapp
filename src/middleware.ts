import { NextResponse } from 'next/server'

export function middleware(req: Request) {
    const response = NextResponse.next()

    // Add Content-Security-Policy header
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self';",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com;",
            "style-src 'self' 'unsafe-inline';",
            "img-src 'self' data: https://backend.hotumatur.com https://vumbnail.com;",
            "font-src 'self';",
            "connect-src 'self' https://backend.hotumatur.com;",
            "frame-src 'self' https://player.vimeo.com;"
        ]
            .join(' ')
            .trim()
    )

    return response
}