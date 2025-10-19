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
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/shadcn-components/ui/button';
import { CircleX } from 'lucide-react';

const DemoForm = ({ fields, deleteField }) => {

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

    const handleDelete = (index) => {
        // console.log(index); ok here

        if (deleteField) {
            deleteField(index);
        }
    }

    // console.log(fields);

    return (
        <div className='w-full'>
            <div className='text-3xl font-sans font-bold text-center'>Demo Form</div>
            <p>Total number of fields: {fields.length}</p>

            <div className='mx-auto w-1/2 border border-border rounded-lg shadow-sm p-5 flex flex-wrap gap-4 mt-2'>
                {fields.map((field, index) => (
                    <div key={index} className='w-full'>
                        {field?.fieldType != 'option' && <div className='flex items-end gap-2'>
                            <Button
                                onClick={() => handleDelete(field?.fieldId)}
                                variant="outline" size="icon" aria-label="Submit">
                                <CircleX color="#ff0000" />
                            </Button>
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
                            </div>
                        </div>
                        }
                        {field?.fieldType === 'option' && (<div className='flex items-end gap-2'>
                            <Button
                                onClick={() => handleDelete(field?.fieldId)}
                                variant="outline" size="icon" aria-label="Submit">
                                <CircleX color="#ff0000" />
                            </Button>
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
                                                    <SelectValue placeholder={`Select ${field.fieldName}`} />
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
                        </div>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default DemoForm;