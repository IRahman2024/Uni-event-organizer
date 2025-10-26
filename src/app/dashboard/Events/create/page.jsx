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


const CreateEvent = () => {
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        reset
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

    const [openEventDate, setOpenEventDate] = useState(false);
    const [openDeadline, setOpenDeadline] = useState(false);
    const [date, setDate] = useState(undefined);
    const [deadline, setDeadline] = useState(null)

    const [eventData, setEventData] = useState([]);
    const [fields, setFields] = useState([]);

    const [imageUrl, setImageUrl] = useState('');

    const handleFormData = (data) => {
        setFields([...fields, data]);
    };

    const deleteField = (id) => {
        console.log(id);

        const updatedFields = fields.filter(item => item.fieldId !== id);
        setFields(updatedFields);
    };

    const onSubmit = (data) => {
        const newEvent = {
            ...data,
            eventDate: date,
            eventDeadline: deadline,
            eventImage: imageUrl,
            // fields,
        }
        setEventData([...eventData, newEvent])
        // reset()
        // setFields([])
        // setDate(null)
        // setDeadline(null)
        console.log('Event details saved:', newEvent)
    }

    const saveEvent = () => {
        const event = { eventData, fields };
        // reset();
        // setDate(null)
        // setDeadline(null)
        // setFields([])
        // setImageUrl(null)
        // setEventData([]);

        const data = {
            ...eventData[0],
            FormFields: {
                createMany:{
                    data: fields
                },
            },
        }

        console.log('Event Data: ', event);

        axios.post('/api/events/createEvent', event)
            .then(response => {
                console.log('Event saved successfully:', response.data);
            })
            .catch(error => {
                console.error('Error saving event:', error);
            });

    }

    console.log('event data: ', eventData);
    console.log('fields data: ', fields);
    console.log('image url: ', imageUrl);



    // {fieldName: 'Name', label: 'saa', fieldType: 'text', isRequired: false, options: ''}
    // {fieldName: 'Size', label: 'Size', fieldType: 'option', isRequired: true, options: 'xl, xxl, sm, md'}

    return (
        <div>
            <div>
                <p className="text-3xl font-sans text-center">Event Form</p>
                <form onSubmit={handleSubmit(onSubmit)} className='mx-auto w-2/3 border border-border rounded-lg shadow-sm p-5 flex flex-wrap gap-4 my-4'>
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
                                            id="time-picker"
                                            step="1"
                                            defaultValue="10:30:00"
                                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        />
                                        <Label htmlFor="time-picker" className="px-1">
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
                                            id="time-picker"
                                            step="1"
                                            defaultValue="10:30:00"
                                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                        />
                                        <Label htmlFor="time-picker" className="px-1">
                                            Time
                                        </Label>
                                    </div>
                                </div>
                            </div>
                            <p className="text-2xl font-bold">Add Event Poster</p>
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
                        Save Event Details
                    </button>
                </form>
            </div>

            <div>
                <p className='font-sans text-3xl font-bold text-center'>Registration Form Builder</p>
                {/* <div className='my-5 border rounded-md p-5 shadow-md'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex gap-2 items-center'>
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label htmlFor="fieldName">Field Name</Label>
                            <Controller
                                name="fieldName"
                                control={control}
                                rules={{ required: 'Field Name is required' }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="fieldName"
                                        placeholder="Field name"
                                        type="text"
                                    />
                                )}
                            />
                            {errors.fieldName && <span className="text-red-500">{errors.fieldName.message}</span>}
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-3">
                            <Label htmlFor="label">Label</Label>
                            <Controller
                                name="label"
                                control={control}
                                rules={{ required: 'Label is required' }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="label"
                                        placeholder="Label"
                                        type="text"
                                    />
                                )}
                            />
                            {errors.fieldName && <span className="text-red-500">{errors.fieldName.message}</span>}
                        </div>
                        <div className="grid w-1/2 max-w-sm items-center gap-3">
                            <Label htmlFor="fieldType">Field Type</Label>
                            <Controller
                                name="fieldType"
                                control={control}
                                rules={{ required: 'Field Type is required' }}
                                render={({ field }) => (
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Field Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="option">Option</SelectItem>
                                            <SelectItem value="email">Email</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.fieldType && <span className="text-red-500">{errors.fieldType.message}</span>}
                        </div>
                        {fieldType === 'option' && (
                            <div className="grid w-full max-w-md items-center gap-3 mt-2">
                                <Label htmlFor="options">Options (comma-separated)</Label>
                                <Controller
                                    name="options"
                                    control={control}
                                    rules={{ required: fieldType === 'option' ? 'Options are required' : false }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="options"
                                            placeholder="Enter options (e.g., Option1, Option2, Option3)"
                                            type="text"
                                        />
                                    )}
                                />
                                {errors.options && <span className="text-red-500">{errors.options.message}</span>}
                            </div>
                        )}
                        <div className="grid w-1/2 max-w-sm items-end gap-3">
                            <Label htmlFor="isRequired">Required</Label>
                            <Controller
                                name="isRequired"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="isRequired"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className='bg-primary p-2 rounded-2xl mt-5 hover:bg-secondary hover:text-secondary-foreground'
                    >
                        Add Field
                    </button>
                </form>
            </div> */}
                <FormBuilder onData={handleFormData} eventData={eventData}></FormBuilder>
                {/* <div className='w-full'>
                <div className='text-3xl font-sans font-bold text-center'>Demo Form</div>
                <p>Total number of fields: {fields.length}</p>

                <div className='mx-auto w-1/2 border border-border rounded-lg shadow-sm p-5 flex flex-wrap gap-4 mt-2'>
                    {fields.map((field, index) => (
                        <div key={index} className='w-full'>
                            {field?.fieldType != 'option' && 
                            <div className="grid w-full max-w-full items-center gap-3">
                                <Label htmlFor={field?.label}>{field?.label}</Label>
                                <Controller
                                    name={field?.fieldName}
                                    control={control}
                                    rules={{ required: `${field?.label} is required` }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field?.fieldName}
                                            placeholder={field?.label}
                                            type={field?.fieldType}
                                        />
                                    )}
                                />
                                {errors.fieldName && <span className="text-red-500">{errors.fieldName.message}</span>}
                            </div>}
                            {field?.fieldType === 'option' && (
                                <div className="grid w-full items-center gap-3">
                                    <Label htmlFor={field.label}>{field.label}</Label>
                                    <Controller
                                        name={field.fieldName}
                                        control={control}
                                        rules={{ required: `${field?.label} is required` }}
                                        render={({ field: selectField }) => {
                                            const optionArray = field.options.split(',').map(o => o.trim()); // Convert options string to array
                                            return (
                                                <Select
                                                    onValueChange={selectField.onChange}
                                                    value={selectField.value}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder={`Select ${field.label}`} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {optionArray.map((option, idx) => (
                                                            <SelectItem key={idx} value={option}>{option}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            );
                                        }}
                                    />
                                    {errors[field.fieldName] && (
                                        <span className="text-red-500">{errors[field.fieldName].message}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div> */}
                <DemoForm fields={fields} deleteField={deleteField}></DemoForm>
            </div>
            <div className='flex w-full justify-center'>
                {
                    fields.length > 0 ? <button
                        onClick={saveEvent}
                        className='bg-emerald-500 w-1/2 ml-2 p-2 rounded-2xl mt-5 hover:bg-secondary hover:text-emerald-500'
                    >
                        Save Event
                    </button> : <button className='p-2 rounded-2xl mt-5 bg-gray-300 text-gray-600 cursor-not-allowed' disabled>
                        Please Add Fields in form first
                    </button>
                }
            </div>
        </div>
    );
};

export default CreateEvent;