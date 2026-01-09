import React from "react";
import { Timeline } from "@/components/ui/timeline";

export function StepsForOrgs() {

    const heading = "Want to organize events like these?";
    // const background = "bg-gradient-to-r from-orange-600 to-red-700";

    const data = [
        {
            title: "Contact Us",
            content: (
                <div>
                    <p
                        className="mb-8 text-xs font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
                        Connect with us for a event organization partnership account.
                    </p>
                    <div className="gap-4">
                        <img
                            src="./Contact-Admin.png"
                            alt="startup template"
                            className="h-96 w-full rounded-lg" />
                    </div>
                </div>
            ),
        },
        {
            title: "Admin Dashboard",
            content: (
                <div>
                    <p
                        className="mb-8 text-xs font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
                        Experience our powerful admin dashboard to manage your events seamlessly.
                    </p>
                    <div className="size-auto w-full" style={{ overflow: 'hidden', borderRadius: '1rem' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/dashboard.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            ),
        },
        {
            title: "Manage events",
            content: (
                <div>
                    <p
                        className="mb-4 text-xs font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
                        Create event with all the event information, manage registrations, and track attendance all in one place.
                    </p>

                    <div style={{ overflow: 'hidden', borderRadius: '1rem' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/organizing event.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            ),
        },
        {
            title: "Impact Tracking",
            content: (
                <div>
                    <p
                        className="mb-4 text-xs font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
                        Track the impact of your events and measure success with detailed analytics and reporting.
                    </p>
                    <div style={{ overflow: 'hidden', borderRadius: '1rem' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/Impact.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className="relative w-full overflow-clip">
            <Timeline data={data} heading={heading} side='right'
            // background={background}
            />
        </div>
    );
}
