// app/api/dashboard/department-analytics/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const eventType = searchParams.get('eventType');
        const department = searchParams.get('department');

        // Build where clause for registrations
        const whereClause = {};

        // Date filtering on registrations
        if (startDate || endDate) {
            whereClause.registeredAt = {};
            if (startDate) whereClause.registeredAt.gte = new Date(startDate);
            if (endDate) whereClause.registeredAt.lte = new Date(endDate);
        } else {
            // Default to current month
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            whereClause.registeredAt = { gte: startOfMonth };
        }

        // Event type filtering
        if (eventType) {
            whereClause.event = {
                eventType: eventType
            };
        }

        // Department filtering
        if (department) {
            whereClause.student = {
                department: department
            };
        }

        // Get all registrations with student and event info
        const registrations = await prisma.registration.findMany({
            where: whereClause,
            include: {
                student: {
                    select: {
                        department: true,
                        batch: true
                    }
                },
                event: {
                    select: {
                        price: true
                    }
                }
            }
        });

        // Aggregate by department
        const departmentMap = {};
        let totalRegistrations = 0;

        registrations.forEach(reg => {
            const dept = reg.student.department;
            totalRegistrations++;

            if (!departmentMap[dept]) {
                departmentMap[dept] = {
                    department: dept,
                    count: 0,
                    revenue: 0,
                    percentage: 0
                };
            }

            departmentMap[dept].count++;
            departmentMap[dept].revenue += parseFloat(reg.event.price);
        });

        // Calculate percentages
        Object.values(departmentMap).forEach(dept => {
            dept.percentage = totalRegistrations > 0
                ? ((dept.count / totalRegistrations) * 100).toFixed(1)
                : 0;
        });

        // Convert to array and sort by count
        const result = Object.values(departmentMap).sort(
            (a, b) => b.count - a.count
        );

        return NextResponse.json({
            success: true,
            data: result,
            timestamp: new Date().toISOString(),
            summary: {
                totalRegistrations,
                departmentCount: result.length
            }
        });

    } catch (error) {
        console.error('Department Analytics Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch department analytics',
                message: error.message
            },
            { status: 500 }
        );
    }
}