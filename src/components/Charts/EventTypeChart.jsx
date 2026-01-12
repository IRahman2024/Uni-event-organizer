// components/dashboard/EventTypeChart.jsx

"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn-components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shadcn-components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, Loader2 } from 'lucide-react';

const chartConfig = {
    registrationCount: {
        label: "Registrations",
        color: "#86a7c8", //bg-chart-1
    },
    revenue: {
        label: "Revenue",
        color: "#8589ff", // bg-chart-2
    },
};

export default function EventTypeChart({ filters = {} }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('registrations'); // 'registrations' or 'revenue'

    useEffect(() => {
        fetchData();
    }, [filters]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.eventType) params.append('eventType', filters.eventType);
            if (filters.department) params.append('department', filters.department);

            const response = await fetch(`/api/dashboard/event-type-analytics?${params}`);
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const totalRegistrations = data.reduce((sum, item) => sum + item.registrationCount, 0);
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

    if (loading) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Event Type Popularity</CardTitle>
                    <CardDescription>Loading analytics...</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[350px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="col-span-full">
                <CardHeader>
                    <CardTitle>Event Type Popularity</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[350px]">
                    <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="col-span-full">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="min-w-0">
                        <CardTitle>Event Type Popularity</CardTitle>
                        <CardDescription className="break-words">
                            {viewMode === 'registrations'
                                ? `Total: ${totalRegistrations} registrations across all event types`
                                : `Total Revenue: ${formatCurrency(totalRevenue)}`
                            }
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('registrations')}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${viewMode === 'registrations'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            Registrations
                        </button>
                        <button
                            onClick={() => setViewMode('revenue')}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${viewMode === 'revenue'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            Revenue
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="eventType"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--foreground))' }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--foreground))' }}
                                tickFormatter={viewMode === 'revenue' ? formatCurrency : undefined}
                            />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload || !payload.length) return null;

                                    const data = payload[0].payload;
                                    return (
                                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                                            <div className="font-semibold mb-2">{data.eventType}</div>
                                            <div className="grid gap-1.5 text-sm">
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-muted-foreground">Registrations:</span>
                                                    <span className="font-medium">{data.registrationCount}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-muted-foreground">Revenue:</span>
                                                    <span className="font-medium">{formatCurrency(data.revenue)}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-muted-foreground">Events:</span>
                                                    <span className="font-medium">{data.eventCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            <Bar
                                dataKey={viewMode === 'registrations' ? 'registrationCount' : 'revenue'}
                                fill={viewMode === 'registrations' ? chartConfig.registrationCount.color : chartConfig.revenue.color}
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {data.length > 0 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                            Most popular: <strong>{data[0]?.eventType}</strong> with {data[0]?.registrationCount} registrations
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}