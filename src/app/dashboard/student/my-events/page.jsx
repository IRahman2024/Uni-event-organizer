'use client'
import { useUser } from '@stackframe/stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import MyEventsTable from './MyEventsTable';

const page = () => {

    const [events, setEvents] = useState([]);
    const [studentData, setStudentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useUser();

    // console.log('loading from page:', loading);
    // console.log('studentData:', studentData);
    // console.log('events:', events);

    const handleViewResponses = (eventId) => {
        onViewResponses(eventId)
    }

    const handleCancelRegistration = async (eventId) => {
        await onCancelRegistration(eventId)
    }


    useEffect(() => {
        const fetchData = async () => {
            // Only proceed if user email exists
            if (!user?.primaryEmail) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // Step 1: Fetch student data
                const studentResponse = await axios.get(`/api/students/${user.primaryEmail}`);
                const fetchedStudentData = studentResponse.data.data;
                setStudentData(fetchedStudentData);

                // Step 2: Fetch events only if studentId exists
                if (fetchedStudentData?.studentId) {
                    const eventsResponse = await axios.get(
                        `/api/events/registration?studentId=${fetchedStudentData.studentId}&eventsAll=true`
                    );
                    setEvents(eventsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                // CRITICAL: Always set loading to false in finally block
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.primaryEmail]);

    return (
        <div>
            <MyEventsTable registrations={events} loading={loading}
                onViewResponses={handleViewResponses}
                onCancelRegistration={handleCancelRegistration}
            />
        </div>
    );
};

export default page;