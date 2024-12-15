import { NextResponse } from 'next/server'

export function middleware() {
    const response = NextResponse.next()

    response.headers.set(
        'Content-Security-Policy',
        `
            default-src 'self';
            script-src 'self' 'unsafe-inline' 'unsafe-eval';
            style-src 'self' 'unsafe-inline';
            img-src 'self' data: https://hotumatur.thefullstack.digital https://vumbnail.com;
            font-src 'self';
            connect-src 'self';
            frame-src 'self' https://player.vimeo.com;
        `.replace(/\s+/g, ' ').trim()
    )

    return response
}