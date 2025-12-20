import { cn } from "@/lib/utils";
import {
    IconAdjustmentsBolt,
    IconCloud,
    IconCurrencyDollar,
    IconEaseInOut,
    IconHeart,
    IconHelp,
    IconRouteAltLeft,
    IconTerminal2,
} from "@tabler/icons-react";

import {
    Calendar,
    CheckCircle,
    BarChart2,
    Users,
    Search,
    Bell,
    MessageSquare,
    Pen,
} from 'lucide-react';

export function Features() {
    const features = [
        {
            title: 'Create & Edit Events',
            description:
                'Launch or tweak events in seconds with rich media and full control.',
            icon: <Calendar className="h-5 w-5" />,
        },
        {
            title: 'One‑Click RSVP',
            description:
                'Students sign up instantly—no forms, no hassle, just a tap.',
            icon: <CheckCircle className="h-5 w-5" />,
        },
        {
            title: 'Live Attendance Dashboard',
            description:
                'See real‑time numbers and trends with interactive charts.',
            icon: <BarChart2 className="h-5 w-5" />,
        },
        {
            title: 'Student Management',
            description:
                'View profiles, filter and manage students directly from the admin panel.',
            icon: <Users className="h-5 w-5" />,
        },
        {
            title: 'Smart Search & Filters',
            description:
                'Find the perfect event by date, topic, or location in seconds.',
            icon: <Search className="h-5 w-5" />,
        },
        {
            title: 'Automated Reminders',
            description:
                'Push & email alerts keep participants on track and reduce no‑shows.',
            icon: <Bell className="h-5 w-5" />,
        },
        {
            title: 'In‑Event Chat',
            description:
                'Engage with organizers and peers during the event in real time.',
            icon: <MessageSquare className="h-5 w-5" />,
        },
        {
            title: 'Calendar Sync',
            description:
                'Create events without colliding with other events.',
            icon: <Pen className="h-5 w-5" />,
        },
    ];

    return (
        <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
            {features.map((feature, index) => (
                <Feature key={feature.title} {...feature} index={index} />
            ))}
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index
}) => {
    return (
        <div
            className={cn(
                "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}>
            {index < 4 && (
                <div
                    className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div
                    className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            <div
                className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
                {icon}
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div
                    className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300  group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span
                    className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p
                className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};
