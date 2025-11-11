export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="font-sans text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to your dashboard</p>
            </div>

            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-card border border-border p-4">
                    <h3 className="font-sans text-sm font-semibold text-card-foreground">Total Events</h3>
                    <p className="text-2xl font-bold text-primary mt-2">24</p>
                </div>
                <div className="aspect-video rounded-xl bg-card border border-border p-4">
                    <h3 className="font-sans text-sm font-semibold text-card-foreground">Participants</h3>
                    <p className="text-2xl font-bold text-primary mt-2">156</p>
                </div>
                <div className="aspect-video rounded-xl bg-card border border-border p-4">
                    <h3 className="font-sans text-sm font-semibold text-card-foreground">Active</h3>
                    <p className="text-2xl font-bold text-primary mt-2">12</p>
                </div>
            </div>

            <div className="min-h-[50vh] rounded-xl bg-card border border-border p-6">
                <h2 className="font-sans text-lg font-semibold text-card-foreground mb-4">Recent Activity</h2>
                <p className="text-muted-foreground">Your main content goes here...</p>
            </div>
        </div>
    )
}