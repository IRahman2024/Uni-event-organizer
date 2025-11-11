// app/dashboard/admin/layout.jsx
"use client"

import { AppSidebar } from "@/shadcn-components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/shadcn-components/ui/sidebar"
import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isAdmin } from "@/lib/roles";

export default function AdminLayout({ children }) {
    const user = useUser({ or: 'redirect' });
    const router = useRouter();

    useEffect(() => {
        if (user && !isAdmin(user)) {
            // Redirect non-admins to student dashboard
            router.replace('/dashboard/student');
        }
    }, [user, router]);

    if (!user || !isAdmin(user)) {
        return <div>Loading...</div>;
    }

    return (
        <SidebarProvider>
            <AppSidebar role="admin" />
            <SidebarInset>
                <header
                    className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}