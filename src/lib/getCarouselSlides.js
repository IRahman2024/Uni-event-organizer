import { cache } from 'react';

export const getCarouselSlides = cache(async () => {
    // If you already have an env variable for your base URL use it:
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://afterclass-kappa.vercel.app';

    const res = await fetch(`${base}/api/events`, {
        // tell Next.js to cache this request aggressively
        // revalidate: 60 means the data will refresh after 60 seconds in background for recheck
        next: { revalidate: 60, tags: ['events'] }, // 60s TTL + tag for on-demand
    });

    if (!res.ok) {
        // fail gracefully → carousel renders empty
        return [];
    }

    const json = await res.json();

    // json.map((slide) => console.log(slide.eventImage));
    

    return json.data.map((slide) => ({
        src: slide.eventImage,
        title: slide.eventTitle,
        deadline: slide.eventDeadline,
        location: slide.location,
        button: { label: 'Learn More', link: `/events/${slide.id}` },
    }));
});