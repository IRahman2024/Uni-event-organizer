// components/Charts/KPICards.jsx

"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn-components/ui/card';
import { Calendar, Users, DollarSign, TrendingUp, TrendingDown, Loader2, BarChart3 } from 'lucide-react';

export default function KPICards({ filters = {} }) {
    const [data, setData] = useState({
        totalEvents: 0,
        totalRegistrations: 0,
        totalRevenue: 0,
        avgFillRate: 0,
        trends: {
            registrations: 0
        }
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            const response = await fetch(`/api/dashboard/kpi-stats?${params}`);
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to load stats');
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

    const formatNumber = (value) => {
        return new Intl.NumberFormat('en-US').format(value);
    };

    const getTrendIcon = (trend) => {
        if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
        if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
        return null;
    };

    const getTrendColor = (trend) => {
        if (trend > 0) return 'text-green-500';
        if (trend < 0) return 'text-red-500';
        return 'text-muted-foreground';
    };

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center h-12">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="col-span-full">
                    <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground text-center">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const cards = [
        {
            title: "Total Events",
            value: formatNumber(data.totalEvents),
            icon: Calendar,
            description: "Events with registrations",
            iconColor: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            title: "Total Registrations",
            value: formatNumber(data.totalRegistrations),
            icon: Users,
            description: data.trends.registrations !== 0
                ? `${Math.abs(data.trends.registrations)}% from last period`
                : "No change from last period",
            trend: data.trends.registrations,
            iconColor: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            title: "Total Revenue",
            value: formatCurrency(data.totalRevenue),
            icon: DollarSign,
            description: "Revenue generated",
            iconColor: "text-yellow-500",
            bgColor: "bg-yellow-500/10"
        },
        {
            title: "Avg Fill Rate",
            value: `${data.avgFillRate}%`,
            icon: BarChart3,
            description: "Average event capacity filled",
            iconColor: "text-purple-500",
            bgColor: "bg-purple-500/10"
        }
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {card.title}
                            </CardTitle>
                            <div className={`p-2 rounded-full ${card.bgColor}`}>
                                <Icon className={`h-4 w-4 ${card.iconColor}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                {card.trend !== undefined && getTrendIcon(card.trend)}
                                <span className={card.trend !== undefined ? getTrendColor(card.trend) : ''}>
                                    {card.description}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}