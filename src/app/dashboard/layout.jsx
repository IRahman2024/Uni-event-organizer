// app/dashboard/layout.jsx
"use client"

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
    const user = useUser({ or: 'redirect' });
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/SignIn');
        }
    }, [user, router]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}