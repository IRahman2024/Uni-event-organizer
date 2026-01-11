import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import path based on your setup

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        // Return empty array if no query
        if (!query || query.trim() === '') {
            return NextResponse.json({ results: [] });
        }

        // Search events by title (case-insensitive)
        const events = await prisma.event.findMany({
            where: {
                eventTitle: {
                    contains: query,
                    mode: 'insensitive', // Case-insensitive search
                },
            },
            select: {
                id: true,
                eventTitle: true,
                eventDate: true,
                location: true,
                eventImage: true,
                eventType: true,
            },
            orderBy: {
                eventDate: 'asc', // Show upcoming events first
            },
            take: 5, // Limit to 5 results for better UX
        });

        return NextResponse.json({ results: events });

    } catch (error) {
        console.error('Search API error:', error);
        return NextResponse.json(
            { error: 'Failed to search events', results: [] },
            { status: 500 }
        );
    }
}