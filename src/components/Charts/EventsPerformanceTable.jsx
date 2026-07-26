"use client";

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn-components/ui/card';
import { BarChart3, ArrowUpDown, ArrowUp, ArrowDown, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { filterData, computeEventsPerformance, sortEventsPerformance } from '@/lib/dashboard-utils';

export default function EventsPerformanceTable({ allData, filters = {} }) {
    const [sortConfig, setSortConfig] = useState({ key: 'eventDate', order: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage, setEventsPerPage] = useState(10);

    const rawData = useMemo(() => {
        if (!allData?.events) return [];
        const filtered = filterData(allData.events, filters);
        return computeEventsPerformance(filtered);
    }, [allData, filters]);

    const data = useMemo(() => {
        return sortEventsPerformance(rawData, sortConfig.key, sortConfig.order);
    }, [rawData, sortConfig]);

    const summary = useMemo(() => ({
        totalEvents: rawData.length,
        totalRegistrations: rawData.reduce((sum, e) => sum + e.registrations, 0),
        totalRevenue: rawData.reduce((sum, e) => sum + e.revenue, 0),
        avgFillRate: rawData.length > 0
            ? (rawData.reduce((sum, e) => sum + e.fillRate, 0) / rawData.length).toFixed(1)
            : 0
    }), [rawData]);

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            order: prev.key === key && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />;
        }
        return sortConfig.order === 'asc'
            ? <ArrowUp className="h-4 w-4" />
            : <ArrowDown className="h-4 w-4" />;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getFillRateColor = (rate) => {
        if (rate >= 80) return 'text-green-600 bg-green-50';
        if (rate >= 50) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = data.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(data.length / eventsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEventsPerPageChange = (value) => {
        setEventsPerPage(parseInt(value));
        setCurrentPage(1);
    };

    const exportToCSV = () => {
        const headers = ['Event Title', 'Type', 'Date', 'Registrations', 'Capacity', 'Fill Rate', 'Revenue', 'Location'];
        const rows = data.map(event => [
            event.eventTitle,
            event.eventType,
            event.displayDate,
            event.registrations,
            event.capacity,
            `${event.fillRate}%`,
            event.revenue,
            event.location
        ]);

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `events-performance-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (data.length === 0) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Events Performance
                    </CardTitle>
                    <CardDescription>No events found</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[400px]">
                    <p className="text-sm text-muted-foreground">No events with registrations found for the selected filters</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-full">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0">
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Events Performance
                        </CardTitle>
                        <CardDescription className="break-words">
                            {summary.totalEvents} events • {summary.totalRegistrations} registrations • {formatCurrency(summary.totalRevenue)} revenue • {summary.avgFillRate}% avg fill rate
                        </CardDescription>
                    </div>
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-3 font-medium">
                                        <button
                                            onClick={() => handleSort('eventTitle')}
                                            className="flex items-center gap-1 hover:text-foreground"
                                        >
                                            Event Title
                                            {getSortIcon('eventTitle')}
                                        </button>
                                    </th>
                                    <th className="text-left p-3 font-medium">Type</th>
                                    <th className="text-left p-3 font-medium">
                                        <button
                                            onClick={() => handleSort('eventDate')}
                                            className="flex items-center gap-1 hover:text-foreground"
                                        >
                                            Date
                                            {getSortIcon('eventDate')}
                                        </button>
                                    </th>
                                    <th className="text-right p-3 font-medium">
                                        <button
                                            onClick={() => handleSort('registrations')}
                                            className="flex items-center gap-1 hover:text-foreground ml-auto"
                                        >
                                            Registrations
                                            {getSortIcon('registrations')}
                                        </button>
                                    </th>
                                    <th className="text-right p-3 font-medium">Capacity</th>
                                    <th className="text-right p-3 font-medium">
                                        <button
                                            onClick={() => handleSort('fillRate')}
                                            className="flex items-center gap-1 hover:text-foreground ml-auto"
                                        >
                                            Fill Rate
                                            {getSortIcon('fillRate')}
                                        </button>
                                    </th>
                                    <th className="text-right p-3 font-medium">
                                        <button
                                            onClick={() => handleSort('revenue')}
                                            className="flex items-center gap-1 hover:text-foreground ml-auto"
                                        >
                                            Revenue
                                            {getSortIcon('revenue')}
                                        </button>
                                    </th>
                                    <th className="text-left p-3 font-medium">Location</th>
                                    <th className="text-center p-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {currentEvents.map((event) => (
                                    <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-3 font-medium">{event.eventTitle}</td>
                                        <td className="p-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted">
                                                {event.eventType}
                                            </span>
                                        </td>
                                        <td className="p-3 text-muted-foreground">{event.displayDate}</td>
                                        <td className="p-3 text-right font-medium">{event.registrations}</td>
                                        <td className="p-3 text-right text-muted-foreground">{event.capacity}</td>
                                        <td className="p-3 text-right">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getFillRateColor(event.fillRate)}`}>
                                                {event.fillRate}%
                                            </span>
                                        </td>
                                        <td className="p-3 text-right font-medium">{formatCurrency(event.revenue)}</td>
                                        <td className="p-3 text-muted-foreground">{event.location}</td>
                                        <td className="p-3 text-center">
                                            <a
                                                href={`/dashboard/admin/Events/${event.id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                                View Details
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-muted-foreground">Show:</label>
                            <select
                                value={eventsPerPage}
                                onChange={(e) => handleEventsPerPageChange(e.target.value)}
                                className="px-3 py-1.5 border rounded-md text-sm bg-background"
                            >
                                <option value="5">5 events</option>
                                <option value="10">10 events</option>
                                <option value="20">20 events</option>
                                <option value="50">50 events</option>
                                <option value="100">100 events</option>
                            </select>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Showing {indexOfFirstEvent + 1} to {Math.min(indexOfLastEvent, data.length)} of {data.length} events
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>

                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                let pageNumber;
                                if (totalPages <= 5) {
                                    pageNumber = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNumber = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNumber = totalPages - 4 + i;
                                } else {
                                    pageNumber = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${currentPage === pageNumber
                                                ? 'bg-primary text-primary-foreground'
                                                : 'border hover:bg-muted'
                                            }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
