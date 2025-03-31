import { NextRequest, NextResponse } from 'next/server';

/**
 * Dynamic placeholder generator API route
 * This route generates a simple placeholder SVG image based on the requested dimensions
 */
export async function GET(request: NextRequest) {
    // Get query parameters for dimensions
    const { searchParams } = new URL(request.url);
    const width = parseInt(searchParams.get('width') || '300', 10);
    const height = parseInt(searchParams.get('height') || '200', 10);
    const text = searchParams.get('text') || 'Placeholder';

    // Generate a simple SVG placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="#2A2A2A" />
        <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="#595959" />
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 10}px" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">
            ${text}
        </text>
        <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 20}px" fill="#CCCCCC" text-anchor="middle" dominant-baseline="middle">
            ${width} × ${height}
        </text>
    </svg>`;

    // Return the SVG with proper headers
    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        }
    });
} 