'use client';
import { Progress, ProgressLabel, ProgressValue, ProgressIndicator, ProgressTrack } from '@/shadcn-components/ui/progress';
import { Skeleton } from '@/shadcn-components/ui/skeleton';
import axios from 'axios';
import { CalendarDays, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import DynamicForms from './DynamicForms';
import { useUser } from '@stackframe/stack';

const Page = () => {
    const { eventId } = useParams();
    const [formFields, setFormFields] = useState([]);
    const [studentData, setStudentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [isVertical, setIsVertical] = useState(false);

    console.log('eventData: ', event);
    console.log('loading: ', isLoading);

    const user = useUser();

    console.log('student data: ', studentData);
    console.log('form fields: ', event?.formFields);


    useEffect(() => {
        setIsLoading(true);
        const fetchEvent = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const res = await axios.get(`/api/events?eventId=${eventId}`);
                setEvent(res.data.data);
                axios.get(`/api/students/${user.primaryEmail}`)
                    .then((res) => {
                        setStudentData(res.data.data)

                    })
            } catch (err) {
                console.error('Error fetching event:', err);
                setError('Failed to load event details');
            } finally {
                setIsLoading(false);
            }
        };

        // axios.get(`/api/students/${user.primaryEmail}`)
        //     .then((res) => {
        //         setStudentData(res.data.data)
        //         // if (!res.data.data) {
        //         //     setStatus(true);
        //         // }
        //     })

        if (eventId) {
            fetchEvent();
        }


    }, [eventId]);

    // Handle form submission
    const handleFormSubmit = async (formData) => {
        try {
            console.log('Form Data Submitted:', formData);

            const formResponses = formData;
            const eventId = event.id;
            const studentId = studentData.studentId;
            const userVerification = {
                studentId: studentData.studentId,
                email: studentData.email,
                status: studentData.status
            }

            const registrationData = { formResponses, eventId, studentId, userVerification };

            // Submit to your API
            const response = await axios.post('/api/events/registration', registrationData);

            console.log('Response:', response.data);
            alert('Registration successful!');

            // You can redirect or show success message here
            // window.location.href = '/success';
        } catch (error) {
            console.log('Submission error:', error);
            if (error.status === 409)
                alert('Registration failed. Already registered once from this account.');
            else
                alert('Registration failed. Please try again.');
        }
    };

    // Detect if image is vertical or horizontal
    const handleImageLoad = (e) => {
        const img = e.target;
        setIsVertical(img.naturalHeight > img.naturalWidth);
    };

    // Error state
    if (error) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <p className='text-destructive text-lg'>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className='mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // if (loading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <div className="text-center">
    //                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    //                 <p className="mt-4 text-muted-foreground">Loading event and form...</p>
    //             </div>
    //         </div>
    //     );
    // }

    // if (error) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <div className="text-center">
    //                 <p className="text-destructive text-lg">{error}</p>
    //                 <button
    //                     onClick={() => window.location.reload()}
    //                     className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
    //                 >
    //                     Retry
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className='flex flex-col items-center min-h-screen p-5 md:p-16 w-full'>
            {/* event details */}
            <div className='flex flex-col items-center p-5 md:p-16 w-full'>
                {/* Image Container */}
                <div className={`flex justify-center w-full ${isVertical ? 'max-w-[500px]' : 'max-w-[768px] md:max-w-[1200px]'}`}>
                    {isLoading ? (
                        <Skeleton className={`w-full rounded-t-3xl ${isVertical ? 'h-[600px] md:h-[800px]' : 'h-[400px] md:h-[600px]'}`} />
                    ) : event?.eventImage ? (
                        <div className={`relative w-full ${isVertical ? 'h-[600px] md:h-[800px]' : 'h-[400px] md:h-[600px]'}`}>
                            <Image
                                src={event.eventImage}
                                alt={event.eventTitle || 'Event image'}
                                className={`rounded-t-3xl ${isVertical ? 'object-contain' : 'object-cover'}`}
                                fill
                                sizes={isVertical ? '(max-width: 768px) 500px, 500px' : '(max-width: 768px) 100vw, 1200px'}
                                priority
                                onLoad={handleImageLoad}
                            />
                        </div>
                    ) : (
                        <div className='w-full h-[400px] md:h-[600px] rounded-t-3xl bg-muted flex items-center justify-center'>
                            <p className='text-muted-foreground'>No image available</p>
                        </div>
                    )}
                </div>

                {/* Event Details */}
                {!isLoading && event && (
                    <div className='w-full max-w-[768px] md:max-w-[1200px] bg-card rounded-b-3xl p-6 md:p-10 shadow-lg'>
                        <h1 className='text-3xl md:text-4xl font-bold mb-4'>{event.eventTitle}</h1>
                        <p className='text-muted-foreground mb-4'>{event.description}</p>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
                            <div>
                                <p className='text-sm text-muted-foreground flex items-center gap-2'><MapPin></MapPin> Location</p>
                                <p className='font-semibold mt-2'>{event.location || 'TBA'}</p>
                            </div>
                            {event.eventDate && (
                                <div>
                                    <p className='text-sm text-muted-foreground flex items-center gap-2'><span><CalendarDays></CalendarDays></span> Date</p>
                                    <p className='font-semibold mt-2'>{event.eventDate.split('T')[0]}</p>
                                </div>
                            )}
                            <div>
                                <p className='text-sm text-muted-foreground'>Event Type</p>
                                <p className='font-semibold capitalize'>{event.eventType || 'N/A'}</p>
                            </div>
                            <div>
                                <Progress value={event.audience} max={event.capacity}>
                                    <div className="flex justify-between">
                                        <ProgressLabel>Already Onboard</ProgressLabel>
                                        {/* Calculate percentage manually for the display text */}
                                        <span className="text-sm tabular-nums">
                                            {Math.round((event.audience / event.capacity) * 100)}%
                                        </span>
                                    </div>
                                    <ProgressTrack /> {/* Indicator is now injected automatically in the logic above */}
                                    <ProgressLabel>{event.capacity - event.audience} seats left!</ProgressLabel>
                                </Progress>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* event form */}
            <section>
                {
                    isLoading ? <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="mt-4 text-muted-foreground">Loading form...</p>
                        </div>
                    </div> :
                        <div className="container mx-auto py-10 px-4 max-w-4xl">
                            <div className="bg-card rounded-xl shadow-lg p-6 md:p-10">
                                <h1 className="text-3xl font-bold mb-2">Event Registration</h1>
                                <p className="text-muted-foreground mb-8">
                                    Please fill out the form below to register for this event.
                                </p>

                                <DynamicForms
                                    fields={event?.formFields}
                                    userData={studentData}
                                    eventId={event.id}
                                    onSubmit={handleFormSubmit}
                                    submitButtonText="Register Now"
                                />
                            </div>
                        </div>
                }
            </section>
        </div>
    );
};

export default Page;