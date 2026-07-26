import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            include: {
                registrations: {
                    include: {
                        student: {
                            select: {
                                department: true,
                                batch: true,
                                name: true,
                                email: true,
                            }
                        }
                    }
                },
                formFields: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({
            success: true,
            data: { events },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('All Data Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch dashboard data',
                message: error.message
            },
            { status: 500 }
        );
    }
}
