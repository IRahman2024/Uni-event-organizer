'use client'
import EventTable from '@/components/EventTable/EventTable';
import TableDetailed from '@/shadcn-components/comp-485';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { set } from 'zod';

const Delete = () => {

    const [events, setEvents] = useState([]);
    const [isLoading, setLoading] = useState(false);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        axios.get('/api/events')
            .then((res) => setEvents(res.data.data))
            .finally(() => setLoading(false));
    }, [])


    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    console.log(events);
    console.log(events.length);

    const handleDelete = async (eventIds) => {  // eventIds is an array like ["id1", "id2", "id3"]
        setLoading(true);

        try {
            // Join array of IDs into comma-separated string
            const idsString = eventIds.join(',');

            const res = await axios.delete(`/api/events/deleteEvent?eventId=${idsString}`);

            console.log('Events deleted successfully:', res.data);

            // Refresh the events list
            await fetchEvents();

        } catch (error) {
            console.error('Delete failed:', error);
            // Optionally show error toast/notification
        } finally {
            setLoading(false);
        }
    }


    return (
        <div>
            This is event delete page.
            <p>total events: {events.length}</p>
            <div className='mt-10'>
                {/* <TableDetailed></TableDetailed> */}
                <EventTable
                    data={events}
                    isLoading={isLoading}
                    // onAddEvent={handleAddEvent}
                    // onEdit={handleEdit}
                    // onView={handleView}
                    onDelete={handleDelete}
                ></EventTable>
            </div>
        </div>
    );
};

export default Delete;