import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AccountSettings } from "@stackframe/stack";

export default function AccountSettingsPage() {
  return <main className="page-shell min-h-screen py-10 sm:py-16"><Link href="/dashboard" className="focus-ring inline-flex items-center gap-2 rounded-lg text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to dashboard</Link><div className="mx-auto mt-8 max-w-4xl"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Account</p><h1 className="mt-2 text-4xl font-bold">Login and security</h1><p className="mt-3 text-muted-foreground">Manage how you access your AfterClass account.</p></div><div className="premium-card p-5 sm:p-8"><AccountSettings /></div></div></main>;
}
