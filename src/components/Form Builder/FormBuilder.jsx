import React from 'react';
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
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { randomUUID } from "crypto";

const FormBuilder = ({ onData, eventData }) => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm({
        defaultValues: {
            fieldName: '',
            label: '',
            fieldType: '',
            isRequired: false,
            options: '',
        },
    });

    const onSubmit = (data) => {
        data.fieldId = crypto.randomUUID().split('-')[0]; // simple unique id        
        onData(data);
        reset();
    };

    // console.log(fields);
    const fieldType = watch('fieldType');

    return (
        <div className='my-5 border rounded-md p-5 shadow-md'>
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
                        {errors.label && <span className="text-red-500">{errors.label.message}</span>}
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
                {eventData.length > 0 ? <button
                    type="submit"
                    className='bg-primary p-2 rounded-2xl mt-5 hover:bg-secondary hover:text-secondary-foreground'
                >
                    Add Field
                </button> : <button className='p-2 rounded-2xl mt-5 bg-gray-300 text-gray-600 cursor-not-allowed' disabled>
                    Please save event first
                </button> }

            </form>
        </div>
    );
};

export default FormBuilder;