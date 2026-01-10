'use client';
import { EventCarousel } from '@/components/EventCarosuel/EventCarousel';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Page = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const res = await axios.get('/api/events');
                setEvents(res.data.data || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Failed to load events. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Filter events by type
    const conferenceEvents = events.filter(event => event.eventType === 'conference');
    const competitionEvents = events.filter(event => event.eventType === 'contest and competitions');
    const culturalEvents = events.filter(event => event.eventType === 'cultural');
    const hackathonEvents = events.filter(event => event.eventType === 'hackathon');
    const meetupEvents = events.filter(event => event.eventType === 'meetup');
    const othersEvents = events.filter(event => event.eventType === 'others');
    const festEvents = events.filter(event => event.eventType === 'tech fest');
    const workshopEvents = events.filter(event => event.eventType === 'workshop');

    console.log(conferenceEvents);
    

    // Loading state
    if (loading) {
        return (
            <div className="w-full min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Loading events...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive text-lg">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Helper function to render carousel section only if events exist
    const renderCarouselSection = (title, eventData) => {
        if (eventData.length === 0) return null;

        return (
            <div className="w-full min-h-48 bg-background flex flex-col items-center justify-center p-4 md:p-10">
                <div className="w-full max-w-6xl">
                    <h2 className="text-3xl font-bold mb-6 text-foreground">{title}</h2>
                    <EventCarousel eventDatas={eventData} />
                </div>
            </div>
        );
    };

    return (
        <div>
            {renderCarouselSection("Conference", conferenceEvents)}
            {renderCarouselSection("Competition and Contests", competitionEvents)}
            {renderCarouselSection("Cultural", culturalEvents)}
            {renderCarouselSection("Hackathons", hackathonEvents)}
            {renderCarouselSection("Meetups", meetupEvents)}
            {renderCarouselSection("Others", othersEvents)}
            {renderCarouselSection("Tech Fest", festEvents)}
            {renderCarouselSection("Workshops", workshopEvents)}

            {/* Show message if no events at all */}
            {events.length === 0 && (
                <div className="w-full min-h-screen bg-background flex items-center justify-center">
                    <p className="text-muted-foreground text-lg">No events available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Page;