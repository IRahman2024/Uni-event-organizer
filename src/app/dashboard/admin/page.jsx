// app/dashboard/page.js

"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn-components/ui/card';
import { Calendar } from 'lucide-react';
import EventTypeChart from '@/components/Charts/EventTypeChart';
import DepartmentChart from '@/components/Charts/DepartmentChart';
import KPICards from '@/components/Charts/KpiCards';
import RevenueTrendChart from '@/components/Charts/RevenueTrendChart';
import EventsPerformanceTable from '@/components/Charts/EventsPerformanceTable';
// import KPICards from '@/components/Charts/KPICards';
// import { Card } from '@/shadcn-components/ui/card';

export default function DashboardPage() {
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        eventType: null,
        department: null
    });

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || null
        }));
    };

    const resetFilters = () => {
        setFilters({
            startDate: null,
            endDate: null,
            eventType: null,
            department: null
        });
    };

    // Get current month for default date display
    const currentMonth = new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Event Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Comprehensive analytics for {currentMonth}
                    </p>
                </div>
                <button
                    onClick={resetFilters}
                    className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
                >
                    Reset Filters
                </button>
            </div>

            {/* KPI Stats Cards */}
            <KPICards filters={filters} />

            {/* Filters Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Date Range Filters */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Start Date</label>
                            <input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">End Date</label>
                            <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm"
                            />
                        </div>

                        {/* Event Type Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Event Type</label>
                            <select
                                value={filters.eventType || ''}
                                onChange={(e) => handleFilterChange('eventType', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                            >
                                <option value="">All Types</option>
                                <option value="conference">Conference</option>
                                <option value="workshop">Workshop</option>
                                <option value="meetup">Meetup</option>
                                <option value="contests and competition">Contests & Competition</option>
                                <option value="hackathon">Hackathon</option>
                                <option value="tech fests">Tech Fests</option>
                                <option value="cultural">Cultural</option>
                                <option value="others">Others</option>
                            </select>
                        </div>

                        {/* Department Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Department</label>
                            <select
                                value={filters.department || ''}
                                onChange={(e) => handleFilterChange('department', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                            >
                                <option value="">All Departments</option>
                                <option value="CSE">CSE</option>
                                <option value="CE">CE</option>
                                <option value="EEE">EEE</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Event Type Analytics Chart */}
            <EventTypeChart filters={filters} />

            {/* Placeholder for more charts - you'll add these next */}
            {/* Department Participation and other charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DepartmentChart filters={filters} />
                <RevenueTrendChart filters={filters} />
            </div>
            {/* Events Performance Table - ADD THIS */}
            <EventsPerformanceTable filters={filters} />
        </div>
    );
}