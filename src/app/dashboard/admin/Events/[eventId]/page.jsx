// app/dashboard/admin/events/[eventId]/page.jsx

"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shadcn-components/ui/card';
import { ArrowLeft, Users, DollarSign, Calendar, MapPin, Download, Loader2, User } from 'lucide-react';

export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.eventId;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');

    useEffect(() => {
        fetchEventDetails();
    }, [eventId]);

    const fetchEventDetails = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/dashboard/events/${eventId}/registrations`);
            const result = await response.json();

            if (result.success) {
                setData(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Failed to load event details');
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

    const exportToCSV = () => {
        if (!data) return;

        const headers = ['Student ID', 'Name', 'Email', 'Department', 'Batch', 'Registered At'];

        // Add form field headers
        data.formFields.forEach(field => {
            headers.push(field.label);
        });

        const rows = filteredRegistrations.map(reg => {
            const row = [
                reg.student.studentId,
                reg.student.name,
                reg.student.email,
                reg.student.department,
                reg.student.batch,
                reg.displayRegisteredAt
            ];

            // Add form responses
            data.formFields.forEach(field => {
                const value = reg.formData[field.fieldName] || 'N/A';
                row.push(Array.isArray(value) ? value.join(', ') : value);
            });

            return row;
        });

        const csv = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.event.eventTitle.replace(/\s+/g, '-')}-registrations-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-[500px]">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="flex items-center justify-center h-[500px]">
                        <div className="text-center">
                            <p className="text-lg font-semibold mb-2">Error</p>
                            <p className="text-sm text-muted-foreground">{error || 'Event not found'}</p>
                            <button
                                onClick={() => router.back()}
                                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                            >
                                Go Back
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Filter registrations
    const filteredRegistrations = data.registrations.filter(reg => {
        const matchesSearch = !searchTerm ||
            reg.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.student.studentId.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDepartment = !departmentFilter || reg.student.department === departmentFilter;

        return matchesSearch && matchesDepartment;
    });

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold tracking-tight">{data.event.eventTitle}</h1>
                    <p className="text-muted-foreground mt-1">{data.event.eventType} • {data.event.displayDate}</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                    <Download className="h-4 w-4" />
                    Export CSV
                </button>
            </div>

            {/* Event Info Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.metrics.totalRegistrations}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.metrics.availableSpots} spots remaining
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fill Rate</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.metrics.fillRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {data.event.capacity} total capacity
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(data.metrics.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {formatCurrency(data.event.price)} per ticket
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Location</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-base font-medium">{data.event.location}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Deadline: {data.event.displayDeadline}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Department Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Department Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                        {Object.entries(data.metrics.departmentBreakdown).map(([dept, count]) => (
                            <div key={dept} className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold">{count}</div>
                                <div className="text-sm text-muted-foreground">{dept}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                    {((count / data.metrics.totalRegistrations) * 100).toFixed(1)}%
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search by name, email, or student ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md"
                            />
                        </div>
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="px-4 py-2 border rounded-md bg-background"
                        >
                            <option value="">All Departments</option>
                            <option value="CSE">CSE</option>
                            <option value="CE">CE</option>
                            <option value="EEE">EEE</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Registrations Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Registered Students ({filteredRegistrations.length})</CardTitle>
                    <CardDescription>Complete list of students with their form responses</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-3 font-medium">Student</th>
                                        <th className="text-left p-3 font-medium">Department</th>
                                        <th className="text-left p-3 font-medium">Batch</th>
                                        <th className="text-left p-3 font-medium">Registered At</th>
                                        {data.formFields.map(field => (
                                            <th key={field.id} className="text-left p-3 font-medium">{field.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredRegistrations.map((reg) => (
                                        <tr key={reg.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    {reg.student.image ? (
                                                        <img
                                                            src={reg.student.image}
                                                            alt={reg.student.name}
                                                            className="h-8 w-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium">{reg.student.name}</div>
                                                        <div className="text-xs text-muted-foreground">{reg.student.email}</div>
                                                        <div className="text-xs text-muted-foreground">{reg.student.studentId}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted">
                                                    {reg.student.department}
                                                </span>
                                            </td>
                                            <td className="p-3 text-muted-foreground">{reg.student.batch}</td>
                                            <td className="p-3 text-muted-foreground text-xs">{reg.displayRegisteredAt}</td>
                                            {data.formFields.map(field => {
                                                const value = reg.formData[field.fieldName];
                                                const displayValue = Array.isArray(value)
                                                    ? value.join(', ')
                                                    : value || 'N/A';
                                                return (
                                                    <td key={field.id} className="p-3 text-muted-foreground">
                                                        {displayValue}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {filteredRegistrations.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No registrations found matching your filters</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}