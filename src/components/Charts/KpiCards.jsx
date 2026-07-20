"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/shadcn-components/ui/card";

const initialData = {
  totalEvents: 0,
  totalRegistrations: 0,
  totalRevenue: 0,
  avgFillRate: 0,
  trends: { registrations: 0 },
};

export default function KPICards({ filters = {} }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (filters.startDate) params.append("startDate", filters.startDate);
        if (filters.endDate) params.append("endDate", filters.endDate);
        if (filters.eventType) params.append("eventType", filters.eventType);
        if (filters.department) params.append("department", filters.department);

        const response = await fetch(`/api/dashboard/kpi-stats?${params}`, {
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Unable to load dashboard statistics");
        }
        setData(result.data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Failed to load statistics");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [filters]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(value || 0));

  const formatNumber = (value) => new Intl.NumberFormat("en-US").format(Number(value || 0));
  const registrationTrend = Number(data?.trends?.registrations || 0);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Loading dashboard statistics">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="overflow-hidden border-border/70">
            <CardContent className="p-5 sm:p-6">
              <div className="flex animate-pulse items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="h-3 w-24 rounded-full bg-muted" />
                  <div className="h-8 w-32 rounded-lg bg-muted" />
                  <div className="h-3 w-36 rounded-full bg-muted" />
                </div>
                <div className="size-11 rounded-2xl bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-dashed border-destructive/30 bg-destructive/[0.03]">
        <CardContent className="flex min-h-28 items-center justify-center p-6 text-center">
          <div>
            <p className="font-medium">Dashboard statistics are temporarily unavailable.</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const cards = [
    {
      title: "Total events",
      value: formatNumber(data.totalEvents),
      icon: CalendarDays,
      description: "Events with registrations",
      iconClass: "bg-primary/10 text-primary",
      glowClass: "bg-primary/15",
    },
    {
      title: "Registrations",
      value: formatNumber(data.totalRegistrations),
      icon: Users,
      description:
        registrationTrend === 0
          ? "No change from last period"
          : `${Math.abs(registrationTrend)}% from last period`,
      trend: registrationTrend,
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      glowClass: "bg-emerald-500/15",
    },
    {
      title: "Total revenue",
      value: formatCurrency(data.totalRevenue),
      icon: CircleDollarSign,
      description: "Revenue generated",
      iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      glowClass: "bg-amber-500/15",
    },
    {
      title: "Average fill rate",
      value: `${Number(data.avgFillRate || 0)}%`,
      icon: BarChart3,
      description: "Average capacity filled",
      iconClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      glowClass: "bg-violet-500/15",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trend > 0 ? TrendingUp : card.trend < 0 ? TrendingDown : null;
        const trendClass = card.trend > 0 ? "text-emerald-600 dark:text-emerald-400" : card.trend < 0 ? "text-red-600 dark:text-red-400" : "text-muted-foreground";

        return (
          <Card key={card.title} className="group relative overflow-hidden border-border/70 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
            <div className={`pointer-events-none absolute -right-8 -top-10 size-28 rounded-full blur-3xl ${card.glowClass}`} aria-hidden="true" />
            <CardContent className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="mt-2 truncate text-3xl font-bold tracking-[-0.035em]">{card.value}</p>
                </div>
                <span className={`grid size-11 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-105 ${card.iconClass}`}>
                  <Icon className="size-5" />
                </span>
              </div>

              <div className={`mt-4 flex items-center gap-1.5 text-xs ${trendClass}`}>
                {TrendIcon && <TrendIcon className="size-3.5" />}
                <span>{card.description}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
