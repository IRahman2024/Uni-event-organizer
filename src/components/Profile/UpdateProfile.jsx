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
} from "@/shadcn-components/ui/select";
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
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
import { useUser } from '@stackframe/stack';
import { Helix } from 'ldrs/react'
import 'ldrs/react/Helix.css'
import { useRouter } from 'next/navigation';
import { useSnackbar, SnackbarProvider } from 'notistack';
import { toastManager } from '@/shadcn-components/ui/toast';

const UpdateProfile = ({ status }) => {

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            name: '',
            studentId: '',
            department: '',
            batch: ''
        },
    })

    const user = useUser();

    const [studentData, setStudentData] = useState([]);

    const [imageUrl, setImageUrl] = useState('');

    const [loading, setLoading] = useState(false);

    // console.log('student data under updater: ', student);
    console.log('stackUserId: ', user?.id);


    const handleFormData = (data) => {
        setFields([...fields, data]);
    };

    const onSubmit = (data) => {
        setLoading(true);
        const newData = {
            ...data,
            email: user.primaryEmail,
            stackUserId: user.id
        }

        if (imageUrl?.trim()) newData.profileImage = imageUrl.trim();
        if (data.studentId?.trim()) newData.studentId = data.studentId.trim();


        console.log('data passed: ', newData);


        axios.patch(`/api/students/${user.primaryEmail}`, newData)
            .then((res) => {
                // alert('Profile updated successfully', res.data);
                // toastManager.add({
                //     title: "Profile updated successful",
                //     // description: "Check email for event details and ticket.",
                //     type: "success"
                // })
                setLoading(false);
                enqueueSnackbar('Profile updated successfully',
                    {
                        variant: 'success',
                        autoHideDuration: 3000
                    }
                )
                setTimeout(() => router.refresh(), 3000);
            })
            .catch((error) => {
                console.log('Error updating profile:', error);
                setLoading(false);
                enqueueSnackbar('Something went wrong! Please try again.',
                    {
                        variant: 'error',
                        autoHideDuration: 3000
                    }

                )
                setTimeout(() => router.refresh(), 3000);
            })

        // reset()

        // console.log('Data:', newData);
    }

    if (loading) {
        return (
            <div className='flex flex-col gap-2 items-center justify-center'>
                <Helix
                    size="79"
                    speed="3.7"
                    color='#0df22cff'
                ></Helix>
                <p className="text-foreground">Updating data please wait...</p>
            </div>
        )
    }

    return (
        <div>
            <p className="text-3xl font-sans text-center">Profile Update</p>
            <form onSubmit={handleSubmit(onSubmit)} className='mx-auto border border-border rounded-lg shadow-sm p-5 flex flex-wrap gap-4 my-4'>
                <FieldSet className='w-full'>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="Name">Name</FieldLabel>
                            <Input {...register('name', { required: true })} id="name" type="text" placeholder="Write your full name" />
                            {errors.eventTitle && <span className="text-red-500">Name required</span>}
                        </Field>
                        {status &&
                            <Field>
                                <FieldLabel htmlFor="studentId">Student Id</FieldLabel>
                                <Input {...register('studentId', { required: true })} id="studentId" type="number" placeholder="Write your student ID here" />
                                {errors.description && <span className="text-red-500">Student ID required</span>}
                            </Field>
                        }
                        <Field>
                            <FieldLabel htmlFor="batch">Batch</FieldLabel>
                            <Input
                                {...register('batch', { required: true })}
                                id="batch" type="number" placeholder="Add Your Batch" />
                            {errors.location && <span className="text-red-500">Batch Required</span>}
                        </Field>
                        <Field>
                            <FieldLabel>Department</FieldLabel>
                            <Controller
                                name="department"
                                control={control}
                                rules={{ required: 'Department is required' }}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Your Department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CSE">CSE (Computer Science and Engineering)</SelectItem>
                                            <SelectItem value="CE">CE (Civil Engineering)</SelectItem>
                                            <SelectItem value="EEE">EEE (Electrical and Electronics Engineering)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </Field>

                        <p className="text-2xl font-bold">Add Profile Photo(Max 100KB)</p>
                        <div className='flex justify-center my-2 max-w-full'>
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
                    Update Profile
                </button>
            </form>
            {/* this one is for alert */}
            <SnackbarProvider
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            />
        </div>
    );
};

export default UpdateProfile;