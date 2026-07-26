export function filterData(events, filters) {
    const { startDate, endDate, eventType, department } = filters;

    return events.filter(event => {
        if (eventType && event.eventType !== eventType) return false;

        const matchingRegistrations = event.registrations.filter(reg => {
            if (startDate) {
                const regDate = new Date(reg.registeredAt);
                if (regDate < new Date(startDate)) return false;
            }
            if (endDate) {
                const regDate = new Date(reg.registeredAt);
                if (regDate > new Date(endDate)) return false;
            }
            if (department && reg.student?.department !== department) return false;
            return true;
        });

        event._filteredRegistrations = matchingRegistrations;
        return true;
    });
}

export function computeKPIs(filteredEvents) {
    let totalEvents = 0;
    let totalRegistrations = 0;
    let totalRevenue = 0;
    let totalCapacity = 0;
    let eventsWithRegistrations = 0;

    filteredEvents.forEach(event => {
        const regs = event._filteredRegistrations || event.registrations;
        const regCount = regs.length;

        if (regCount > 0) {
            totalEvents++;
            totalRegistrations += regCount;
            totalRevenue += parseFloat(event.price) * regCount;
            totalCapacity += event.capacity;
            eventsWithRegistrations++;
        }
    });

    const avgFillRate = eventsWithRegistrations > 0
        ? ((totalRegistrations / totalCapacity) * 100).toFixed(1)
        : 0;

    const now = new Date();
    const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    let prevRegistrations = 0;
    filteredEvents.forEach(event => {
        event.registrations.forEach(reg => {
            const regDate = new Date(reg.registeredAt);
            if (regDate >= prevMonthStart && regDate <= prevMonthEnd) {
                prevRegistrations++;
            }
        });
    });

    const registrationTrend = prevRegistrations > 0
        ? (((totalRegistrations - prevRegistrations) / prevRegistrations) * 100).toFixed(1)
        : 0;

    return {
        totalEvents,
        totalRegistrations,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        avgFillRate: parseFloat(avgFillRate),
        trends: {
            registrations: parseFloat(registrationTrend)
        }
    };
}

export function computeEventTypeAnalytics(filteredEvents) {
    const ALL_EVENT_TYPES = [
        "conference", "workshop", "meetup", "contests and competition",
        "hackathon", "tech fests", "cultural", "others"
    ];

    const eventTypeMap = {};
    ALL_EVENT_TYPES.forEach(type => {
        eventTypeMap[type] = {
            eventType: type,
            registrationCount: 0,
            revenue: 0,
            eventCount: 0
        };
    });

    filteredEvents.forEach(event => {
        const regs = event._filteredRegistrations || event.registrations;
        if (regs.length === 0) return;

        const type = event.eventType;
        if (!eventTypeMap[type]) {
            eventTypeMap[type] = {
                eventType: type,
                registrationCount: 0,
                revenue: 0,
                eventCount: 0
            };
        }

        eventTypeMap[type].registrationCount += regs.length;
        eventTypeMap[type].revenue += parseFloat(event.price) * regs.length;
        eventTypeMap[type].eventCount += 1;
    });

    return Object.values(eventTypeMap).sort(
        (a, b) => b.registrationCount - a.registrationCount
    );
}

export function computeDepartmentAnalytics(filteredEvents) {
    const departmentMap = {};
    let totalRegistrations = 0;

    filteredEvents.forEach(event => {
        const regs = event._filteredRegistrations || event.registrations;
        regs.forEach(reg => {
            const dept = reg.student?.department || 'Unknown';
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
            departmentMap[dept].revenue += parseFloat(event.price);
        });
    });

    Object.values(departmentMap).forEach(dept => {
        dept.percentage = totalRegistrations > 0
            ? ((dept.count / totalRegistrations) * 100).toFixed(1)
            : 0;
    });

    return Object.values(departmentMap).sort(
        (a, b) => b.count - a.count
    );
}

export function computeRevenueTrend(filteredEvents, interval = 'daily') {
    const revenueMap = {};

    filteredEvents.forEach(event => {
        const regs = event._filteredRegistrations || event.registrations;
        regs.forEach(reg => {
            const date = new Date(reg.registeredAt);
            let key;

            if (interval === 'weekly') {
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                key = weekStart.toISOString().split('T')[0];
            } else {
                key = date.toISOString().split('T')[0];
            }

            if (!revenueMap[key]) {
                revenueMap[key] = {
                    date: key,
                    revenue: 0,
                    registrations: 0
                };
            }

            revenueMap[key].revenue += parseFloat(event.price);
            revenueMap[key].registrations += 1;
        });
    });

    const result = Object.values(revenueMap).sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    return result.map(item => ({
        ...item,
        revenue: parseFloat(item.revenue.toFixed(2)),
        displayDate: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(interval === 'weekly' ? { year: 'numeric' } : {})
        })
    }));
}

export function computeEventsPerformance(filteredEvents) {
    const eventsData = filteredEvents
        .map(event => {
            const regs = event._filteredRegistrations || event.registrations;
            const registrationCount = regs.length;
            const revenue = parseFloat(event.price) * registrationCount;
            const fillRate = event.capacity > 0
                ? ((registrationCount / event.capacity) * 100).toFixed(1)
                : 0;

            return {
                id: event.id,
                eventTitle: event.eventTitle,
                eventType: event.eventType,
                location: event.location,
                eventDate: event.eventDate,
                eventDeadline: event.eventDeadline,
                capacity: event.capacity,
                price: parseFloat(event.price),
                registrations: registrationCount,
                revenue: parseFloat(revenue.toFixed(2)),
                fillRate: parseFloat(fillRate),
                status: event.status || 'active',
                displayDate: new Date(event.eventDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                displayDeadline: new Date(event.eventDeadline).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })
            };
        })
        .filter(event => event.registrations > 0);

    return eventsData;
}

export function sortEventsPerformance(data, sortBy, sortOrder) {
    return [...data].sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
            case 'eventTitle':
                comparison = a.eventTitle.localeCompare(b.eventTitle, undefined, { sensitivity: 'base' });
                break;
            case 'registrations':
                comparison = a.registrations - b.registrations;
                break;
            case 'revenue':
                comparison = a.revenue - b.revenue;
                break;
            case 'fillRate':
                comparison = a.fillRate - b.fillRate;
                break;
            case 'eventDate':
            default:
                comparison = new Date(a.eventDate) - new Date(b.eventDate);
                break;
        }

        return sortOrder === 'asc' ? comparison : -comparison;
    });
}
