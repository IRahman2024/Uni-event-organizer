'use client'
import { Input } from '@/shadcn-components/ui/input';
import { Label } from '@/shadcn-components/ui/label';
import { Checkbox } from '@/shadcn-components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn-components/ui/select"
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormBuilder from '@/components/Form Builder/FormBuilder';
import DemoForm from '@/components/Form Demo/DemoForm';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/shadcn-components/ui/field';
import { Textarea } from '@/shadcn-components/ui/textarea';

import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/shadcn-components/ui/button"
import { Calendar } from "@/shadcn-components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn-components/ui/popover"
import ImageUploader from '@/components/uploadThings/ImageUploader';
import axios from 'axios';
import { Form } from 'radix-ui';
import Loading from '@/app/loading';
import { useParams } from 'next/navigation';


const EditEvents = () => {
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        reset,
        setValue
    } = useForm({
        defaultValues: {
            eventTitle: '',
            description: '',
            location: '',
            eventType: '',
            capacity: '',
            price: '',
        },
    })

    // const [fetchData, setFetchData] = useState(null);
    const [openEventDate, setOpenEventDate] = useState(false);
    const [openDeadline, setOpenDeadline] = useState(false);
    const [date, setDate] = useState(undefined);
    const [deadline, setDeadline] = useState(null);
    const [eventTime, setEventTime] = useState("10:30:00");
    const [deadlineTime, setDeadlineTime] = useState("10:30:00");

    const [eventData, setEventData] = useState([]);
    const [fields, setFields] = useState([]);

    const [imageUrl, setImageUrl] = useState('');

    const [loading, setLoading] = useState(true);
    const [dataLoaded, setDataLoaded] = useState(false);

    const params = useParams();
    const eventId = params.id; 

    // Fetch event data on component mount
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/events?eventId=${eventId}`)
            .then((res) => {
                const eventData = res.data.data;
                console.log(eventData);
                

                // Populate form fields with existing data
                setValue('eventTitle', eventData.eventTitle || '');
                setValue('description', eventData.description || '');
                setValue('location', eventData.location || '');
                setValue('eventType', eventData.eventType || '');
                setValue('capacity', eventData.capacity || '');
                setValue('price', eventData.price || '');

                // Set dates
                if (eventData.eventDate) {
                    const eventDate = new Date(eventData.eventDate);
                    setDate(eventDate);
                    // Extract time from date
                    const hours = eventDate.getHours().toString().padStart(2, '0');
                    const minutes = eventDate.getMinutes().toString().padStart(2, '0');
                    const seconds = eventDate.getSeconds().toString().padStart(2, '0');
                    setEventTime(`${hours}:${minutes}:${seconds}`);
                }

                if (eventData.eventDeadline) {
                    const deadlineDate = new Date(eventData.eventDeadline);
                    setDeadline(deadlineDate);
                    // Extract time from deadline
                    const hours = deadlineDate.getHours().toString().padStart(2, '0');
                    const minutes = deadlineDate.getMinutes().toString().padStart(2, '0');
                    const seconds = deadlineDate.getSeconds().toString().padStart(2, '0');
                    setDeadlineTime(`${hours}:${minutes}:${seconds}`);
                }

                // Set image URL
                if (eventData.eventImage) {
                    setImageUrl(eventData.eventImage);
                }

                // Load existing form fields and transform them to match the expected format
                if (eventData.formFields && eventData.formFields.length > 0) {
                    const transformedFields = eventData.formFields.map(field => ({
                        fieldId: field.id, // Use the database id as fieldId
                        fieldName: field.fieldName,
                        label: field.label,
                        fieldType: field.fieldType === 'select' ? 'option' : field.fieldType, // Transform 'select' to 'option'
                        isRequired: field.isRequired,
                        options: field.options || '',
                    }));
                    setFields(transformedFields);
                }

                setDataLoaded(true);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching event data:', error);
                setLoading(false);
            });
    }, [eventId, setValue]);

    const handleFormData = (data) => {
        setFields([...fields, data]);
    };

    const deleteField = (id) => {
        const updatedFields = fields.filter(item => item.fieldId !== id);
        setFields(updatedFields);
    };

    const onSubmit = (data) => {
        const newEvent = {
            ...data,
            eventDate: date,
            eventDeadline: deadline,
            eventImage: imageUrl,
        }
        setEventData([newEvent]);
    }


    // update api needed
    const saveEvent = () => {
        // Prepare the updated event data
        const updatedEvent = {
            ...eventData[0],
            fields: fields
        };

        console.log('Updated Event Data: ', updatedEvent);

        setLoading(true);

        // TODO: Replace this with your actual update API endpoint
        axios.put(`/api/events/updateEvent/${eventId}`, updatedEvent)
            .then(response => {
                console.log('Event updated successfully:', response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error updating event:', error);
                setLoading(false);
            });

        // For now, just log and stop loading
        // setTimeout(() => {
        //     console.log('Event would be updated with:', updatedEvent);
        //     setLoading(false);
        //     alert('Event updated successfully! (API call not implemented yet)');
        // }, 1000);
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center'>
                <Loading text={'Loading event data. Please wait...'}></Loading>
            </div>
        )
    }

    return (
        <div>
            <div>
                <p className="text-3xl font-sans text-center">Edit Event</p>
                <form onSubmit={handleSubmit(onSubmit)} className='mx-auto w-full md:w-2/3 border border-border rounded-lg shadow-sm p-5 flex flex-wrap gap-4 my-4 overflow-hidden'>
                    <FieldSet className='w-full'>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="EventTitle">Event Title</FieldLabel>
                                <Input {...register('eventTitle', { required: true })} id="eventTitle" type="text" placeholder="Event Title Goes Here" />
                                {errors.eventTitle && <span className="text-red-500">Title required</span>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea
                                    {...register('description', { required: true })}
                                    id="description"
                                    placeholder="Please insert event description here..."
                                    rows={3}
                                />
                                {errors.description && <span className="text-red-500">Description required</span>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="location">Location of the event venue</FieldLabel>
                                <Input
                                    {...register('location', { required: true })}
                                    id="location" type="text" placeholder="Add venue location or online link for zoom/meet...." />
                                {errors.location && <span className="text-red-500">Location required</span>}
                            </Field>
                            {/* calender */}
                            <div>
                                <FieldLabel>Date and time For the Event</FieldLabel>
                                <div className="flex gap-4 mt-2">
                                    <div className="flex flex-col gap-3">
                                        {/* Event Date */}
                                        <Popover open={openEventDate} onOpenChange={setOpenEventDate}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" id="date-picker" className="w-full justify-between font-normal">
                                                    {date ? date.toLocaleDateString() : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        setDate(date);
                                                        setOpenEventDate(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Input
                                            type="time"
                                            id="event-time-picker"
                                            step="1"
                                            value={eventTime}
                                            onChange={(e) => setEventTime(e.target.value)}
                                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        />
                                        <Label htmlFor="event-time-picker" className="px-1">
                                            Time
                                        </Label>
                                    </div>
                                </div>
                            </div>
                            <Field>
                                <FieldLabel>Event Type</FieldLabel>
                                <Controller
                                    name="eventType"
                                    control={control}
                                    rules={{ required: 'Event Type is required' }}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select event type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="conference">Conference</SelectItem>
                                                <SelectItem value="workshop">Workshop</SelectItem>
                                                <SelectItem value="meetup">Meetup and Networking</SelectItem>
                                                <SelectItem value="competition">Competition</SelectItem>
                                                <SelectItem value="hackathon">Hackathon</SelectItem>
                                                <SelectItem value="competitive programming">Competitive Programming</SelectItem>
                                                <SelectItem value="cultural">Cultural</SelectItem>
                                                <SelectItem value="others">Others</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="capacity">Event Capacity</FieldLabel>
                                <Input {...register('capacity', { required: true })} id="capacity" type="number" placeholder="Add maximum event capacity here..." />
                                {errors.capacity && <span className="text-red-500">Capacity required</span>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="price">Pricing (taka)</FieldLabel>
                                <Input {...register('price', { required: true })} id="price" type="number" placeholder="Insert price for individual entry..." />
                                {errors.price && <span className="text-red-500">Price required</span>}
                            </Field>
                            <div>
                                <FieldLabel>Event Deadline</FieldLabel>
                                <div className="flex gap-4 mt-2">
                                    <div className="flex flex-col gap-3">
                                        <Popover open={openDeadline} onOpenChange={setOpenDeadline}>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" id="date-picker" className="w-full justify-between font-normal">
                                                    {deadline ? deadline.toLocaleDateString() : "Select date"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={deadline}
                                                    captionLayout="dropdown"
                                                    onSelect={(date) => {
                                                        setDeadline(date);
                                                        setOpenDeadline(false);
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Input
                                            type="time"
                                            id="deadline-time-picker"
                                            step="1"
                                            value={deadlineTime}
                                            onChange={(e) => setDeadlineTime(e.target.value)}
                                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        />
                                        <Label htmlFor="deadline-time-picker" className="px-1">
                                            Time
                                        </Label>
                                    </div>
                                </div>
                            </div>
                            <p className="text-2xl font-bold">Update Event Poster</p>
                            <div className='flex justify-center my-2'>
                                <ImageUploader
                                    endpoint={'imageUploader'}
                                    value={imageUrl}
                                    onChange={(url) => {
                                        setImageUrl(url)
                                    }}
                                ></ImageUploader>
                            </div>
                        </FieldGroup>
                    </FieldSet>
                    <button
                        type="submit"
                        className='bg-primary p-3 rounded-2xl mt-5 hover:bg-secondary hover:text-secondary-foreground text-sm'
                    >
                        Update Event Details
                    </button>
                </form>
            </div>

            <div>
                <p className='font-sans text-3xl font-bold text-center'>Registration Form Builder</p>
                <FormBuilder onData={handleFormData} eventData={eventData}></FormBuilder>
                <DemoForm fields={fields} deleteField={deleteField}></DemoForm>
            </div>
            <div className='flex w-full justify-center'>
                {
                    eventData.length > 0 ? <button
                        onClick={saveEvent}
                        className='bg-emerald-500 w-1/2 ml-2 p-2 rounded-2xl mt-5 hover:bg-secondary hover:text-emerald-500'
                    >
                        Update Event
                    </button> : <button className='p-2 rounded-2xl mt-5 bg-gray-300 text-gray-600 cursor-not-allowed' disabled>
                        Please update event details first
                    </button>
                }
            </div>
        </div>
    );
};

export default EditEvents;