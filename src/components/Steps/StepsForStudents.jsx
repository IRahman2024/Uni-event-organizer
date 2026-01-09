import React from "react";
import { Timeline } from "../ui/timeline";


export function StepsForStudents() {
    const heading = "Get started in 5 simple steps !";
    // const bgcolor = 'bg-gradient-to-b from-cyan-300 to-cyan-800';
    const data = [
        {
            title: "Signup",
            content: (
                <div>
                    <p
                        className="mb-8 text-xs font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
                        Just hit the signup from navbar.
                    </p>
                    <div style={{ height: '50vh', overflow: 'hidden', borderRadius: '1rem' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/sign-up.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            ),
        },
        {
            title: "Complete User Profile",
            content: (
                <div>
                    <p
                        className="mb-8 text-xs font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
                        Go to the user profile and complete your profile with your campus details.
                    </p>
                    <div style={{ overflow: 'hidden', borderRadius: '1rem' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/Userprofile.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            ),
        },
        {
            title: "Find event",
            content: (
                <div>
                    <p
                        className="mb-4 text-xs font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
                        Find your campus events in the events section.
                    </p>
                    <div className="size-auto" style={{ overflow: 'hidden', borderRadius: '1rem' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/searching event.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            ),
        },
        {
            title: "Join Event",
            content: (
                <div>
                    <p
                        className="mb-4 text-xs font-normal text-neutral-800 md:text-2xl dark:text-neutral-200">
                        Fill the event form and join the event.
                    </p>
                    <div className="size-auto" style={{ overflow: 'hidden', borderRadius: '1rem' }}>
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                        >
                            <source src="/Registering-Events.mp4" type="video/mp4" />
                        </video>
                    </div>
                </div>
            ),
        },
    ];
    return (
        <div className="relative w-full overflow-clip bg-transparent">
            <Timeline data={data} heading={heading} side='left'
            // background={bgcolor}
            />
        </div>
    );
}
