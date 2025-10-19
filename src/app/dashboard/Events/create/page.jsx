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


const CreateEvent = () => {
    // const {
    //     control,
    //     handleSubmit,
    //     formState: { errors },
    //     watch
    // } = useForm();

    const [fields, setFields] = useState([]);

    const handleFormData = (data) => {
        setFields([...fields, data]);
    };

    const deleteField = (index) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);
    }


    // {fieldName: 'Name', label: 'saa', fieldType: 'text', isRequired: false, options: ''}
    // {fieldName: 'Size', label: 'Size', fieldType: 'option', isRequired: true, options: 'xl, xxl, sm, md'}

    return (
        <div>
            <div className='font-sans text-3xl font-bold text-center'>Registration Form Builder</div>
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
            <FormBuilder onData={handleFormData}></FormBuilder>
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
            <DemoForm fields={fields} handleDelete={deleteField}></DemoForm>
        </div>
    );
};

export default CreateEvent;