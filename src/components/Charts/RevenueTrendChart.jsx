// components/Charts/RevenueTrendChart.jsx

"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn-components/ui/card';
import { ChartContainer, ChartTooltip } from '@/shadcn-components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { DollarSign, Loader2, TrendingUp } from 'lucide-react';

const chartConfig = {
    revenue: {
        label: "Revenue",
        color: "#86a7c8",
    },
    registrations: {
        label: "Registrations",
        color: "#8589ff",
    },
};

export default function RevenueTrendChart({ filters = {} }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState({ totalRevenue: 0, totalRegistrations: 0, dataPoints: 0, interval: 'daily' });
    const [interval, setInterval] = useState('daily');

    useEffect(() => {
        fetchData();
    }, [filters, interval]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.eventType) params.append('eventType', filters.eventType);
            if (filters.department) params.append('department', filters.department);
            params.append('interval', interval);

            const response = await fetch(`/api/dashboard/revenue-trend?${params}`);
            const result = await response.json();

            if (result.success) {
                setData(result.data);
                setSummary(result.summary);
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
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Revenue Trends
                    </CardTitle>
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
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Revenue Trends
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[350px]">
                    <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Revenue Trends
                    </CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[350px]">
                    <p className="text-sm text-muted-foreground">No revenue data found for the selected filters</p>
                </CardContent>
            </Card>
        );
    }

    // Calculate growth rate
    const firstRevenue = data[0]?.revenue || 0;
    const lastRevenue = data[data.length - 1]?.revenue || 0;
    const growthRate = firstRevenue > 0
        ? (((lastRevenue - firstRevenue) / firstRevenue) * 100).toFixed(1)
        : 0;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Revenue Trends
                        </CardTitle>
                        <CardDescription>
                            Total Revenue: {formatCurrency(summary.totalRevenue)} • {summary.totalRegistrations} registrations
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setInterval('daily')}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${interval === 'daily'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setInterval('weekly')}
                            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${interval === 'weekly'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            Weekly
                        </button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6ada25ff" stopOpacity={0.9} />
                                    <stop offset="95%" stopColor="#00ade2ff" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="displayDate"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--foreground))' }}
                                angle={-45}
                                textAnchor="end"
                                height={80}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--foreground))' }}
                                tickFormatter={formatCurrency}
                            />
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload || !payload.length) return null;

                                    const data = payload[0].payload;
                                    return (
                                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                                            <div className="font-semibold mb-2">{data.displayDate}</div>
                                            <div className="grid gap-1.5 text-sm">
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-muted-foreground">Revenue:</span>
                                                    <span className="font-medium">{formatCurrency(data.revenue)}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-muted-foreground">Registrations:</span>
                                                    <span className="font-medium">{data.registrations}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="hsl(var(--chart-1))"
                                strokeWidth={2}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {data.length > 1 && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        <span>
                            {growthRate > 0 ? 'Growth' : 'Change'}: <strong className={growthRate > 0 ? 'text-green-500' : 'text-red-500'}>{growthRate}%</strong> from first to last data point
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}