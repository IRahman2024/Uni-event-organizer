"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn-components/ui/card';
import { ChartContainer, ChartTooltip } from '@/shadcn-components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Users } from 'lucide-react';
import { filterData, computeDepartmentAnalytics } from '@/lib/dashboard-utils';

const COLORS = {
    'CSE': '#2d8706ff',
    'CE': '#929591ff',
    'EEE': '#2a64c9ff',
};

const chartConfig = {
    count: {
        label: "Registrations",
    },
    CSE: {
        label: "CSE",
        color: COLORS.CSE,
    },
    CE: {
        label: "CE",
        color: COLORS.CE,
    },
    EEE: {
        label: "EEE",
        color: COLORS.EEE,
    },
};

export default function DepartmentChart({ allData, filters = {} }) {
    const data = useMemo(() => {
        if (!allData?.events) return [];
        const filtered = filterData(allData.events, filters);
        return computeDepartmentAnalytics(filtered);
    }, [allData, filters]);

    const summary = useMemo(() => ({
        totalRegistrations: data.reduce((sum, d) => sum + d.count, 0),
        departmentCount: data.length,
    }), [data]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-BD', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Department Participation
                    </CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[350px]">
                    <p className="text-sm text-muted-foreground">No registrations found for the selected filters</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Department Participation
                </CardTitle>
                <CardDescription>
                    Total {summary.totalRegistrations} registrations across {summary.departmentCount} departments
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ department, percentage }) => `${department}: ${percentage}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="department"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.department] || 'hsl(var(--chart-4))'} />
                                ))}
                            </Pie>
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (!active || !payload || !payload.length) return null;

                                    const data = payload[0].payload;
                                    return (
                                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                                            <div className="font-semibold mb-2">{data.department}</div>
                                            <div className="grid gap-1.5 text-sm">
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-muted-foreground">Registrations:</span>
                                                    <span className="font-medium">{data.count}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-muted-foreground">Percentage:</span>
                                                    <span className="font-medium">{data.percentage}%</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-muted-foreground">Revenue:</span>
                                                    <span className="font-medium">{formatCurrency(data.revenue)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value, entry) => {
                                    const dept = data.find(d => d.department === value);
                                    return dept ? `${value} (${dept.count})` : value;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {data.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        {data.map((dept) => (
                            <div key={dept.department} className="space-y-1">
                                <div className="text-2xl font-bold">{dept.percentage}%</div>
                                <div className="text-sm text-muted-foreground">{dept.department}</div>
                                <div className="text-xs text-muted-foreground">{dept.count} registrations</div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
