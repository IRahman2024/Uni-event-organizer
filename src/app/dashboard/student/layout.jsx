// app/dashboard/student/layout.jsx
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
import { isStudent } from "@/lib/roles";
import { SnackbarProvider } from "notistack";

export default function StudentLayout({ children }) {
    const user = useUser({ or: 'redirect' });
    const router = useRouter();

    useEffect(() => {
        if (user && !isStudent(user)) {
            // Redirect admins to admin dashboard
            router.replace('/dashboard/admin');
        }
    }, [user, router]);

    if (!user || !isStudent(user)) {
        return <div>Loading...</div>;
    }

    return (
        <SidebarProvider>
            <AppSidebar role="student" />
            <SidebarInset>
                <SnackbarProvider
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                >
                    <header
                        className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {children}
                    </div>
                </SnackbarProvider>
            </SidebarInset>
        </SidebarProvider>
    );
}