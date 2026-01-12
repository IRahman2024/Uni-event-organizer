'use client'
import EventTable from '@/components/EventTable/EventTable';
import TableDetailed from '@/shadcn-components/comp-485';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { set } from 'zod';

const ManageEvents = () => {

    const [events, setEvents] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [isUpdating, setUpdating] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    const fetchEvents = useCallback(async () => {
        setLoading(true);

        try {
            const res = await axios.get('/api/events')
            setEvents(res.data.data)
        } catch (error) {
            console.log('error while fetching: ', error);
        }
        finally {
            setLoading(false)
        };

    }, [])


    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    // console.log(events);
    console.log(events.length);

    const router = useRouter();

    const toEditPage = (id) =>{
        console.log('edit eventId: ', id);
        // console.log(`/dashboard/Events/edit/${id}`);
        router.push(`/dashboard/admin/Events/edit/${id}`);
        
    }

    const handleDelete = async (eventIds) => {  // eventIds is an array like ["id1", "id2", "id3"]
        setLoading(true);
        setDeleting(true);
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
            setDeleting(false);
        }
    }

    // const handleStatusChange = async (eventId, newStatus) => {
    //     // console.log('got edit request on eventId: ', eventId, 'status: ', newStatus);
    //     setUpdating(true);
    //     console.log(eventId, newStatus);

    //     axios.patch(`/api/events/updateEvent/${eventId}`, {
    //         status: newStatus
    //     })
    //         .then((res) => {
    //             console.log(res);
    //             await fetchEvents();
    //         })
    //         .finally(() => setUpdating(false))
    // }

    const handleStatusChange = async (eventId, newStatus) => {
        setUpdating(true);
        try {
            await axios.patch(`/api/events/updateEvent/${eventId}`, {
                status: newStatus
            });
            await fetchEvents(); // Ensure this is async/await
        } catch (error) {
            console.error("Update failed:", error);
            // Optional: toast.error("Failed to update status")
        } finally {
            setUpdating(false);
        }
    };


    return (
        <div>
            <p>Total Events Listed: {events.length}</p>
            <div className='mt-10'>
                {/* <TableDetailed></TableDetailed> */}
                <EventTable
                    data={events}
                    isLoading={isLoading}
                    // onAddEvent={handleAddEvent}
                    onEdit={toEditPage}
                    onStatusChange={handleStatusChange}
                    // onView={handleView}
                    onDelete={handleDelete}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                ></EventTable>
            </div>
        </div>
    );
};

export default ManageEvents;