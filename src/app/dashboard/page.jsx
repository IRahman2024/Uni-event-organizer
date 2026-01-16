// app/dashboard/page.jsx
"use client"

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserRole, ROLES } from "@/lib/roles";

export default function DashboardPage() {
    const user = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            const role = getUserRole(user);

            if (role === ROLES.ADMIN) {
                router.replace('/dashboard/admin');
            } else {
                // router.replace('/dashboard/student/my-profile');
                router.replace('/dashboard/student/my-events');
            }
        }
    }, [user, router]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Redirecting...</p>
        </div>
    );
}