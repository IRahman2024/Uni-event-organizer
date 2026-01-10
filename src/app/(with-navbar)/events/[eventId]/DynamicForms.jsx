'use client';
import React, { useState, useEffect } from 'react';
import { Label } from '@/shadcn-components/ui/label';
import { Input } from '@/shadcn-components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn-components/ui/select';
import { Button } from '@/shadcn-components/ui/button';
import { AlertCircle, ShieldAlert, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/shadcn-components/ui/alert';
import { toastManager } from '@/shadcn-components/ui/toast';

const DynamicForm = ({
    fields,
    onSubmit,
    submitButtonText = "Submit",
    userData = null, // { studentId, email, batch, department, name, status }
    eventId = null
}) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasRegistered, setHasRegistered] = useState(false);
    const [checkingRegistration, setCheckingRegistration] = useState(true);

    // Check if user is authenticated and not banned
    const isUserValid = userData && userData.status === 'active';
    const isBanned = userData && userData.status === 'banned';
    const isNotLoggedIn = !userData;

    // Check if user has already registered
    useEffect(() => {
        const checkExistingRegistration = async () => {
            if (!userData || !eventId) {
                setCheckingRegistration(false);
                return;
            }

            try {
                setCheckingRegistration(true);
                // Check if user already registered for this event
                const response = await fetch(`/api/events/registration?eventId=${eventId}&studentId=${userData.studentId}`);
                const data = await response.json();

                setHasRegistered(data.hasRegistered);
            } catch (error) {
                console.error('Error checking registration:', error);
            } finally {
                setCheckingRegistration(false);
            }
        };

        checkExistingRegistration();
    }, [userData, eventId]);

    // Pre-fill form with user data
    useEffect(() => {
        if (userData && isUserValid) {
            const preFillData = {};

            fields.forEach(field => {
                // Map userData fields to form fields
                if (field.fieldName === 'studentId' && userData.studentId) {
                    preFillData[field.fieldName] = userData.studentId;
                } else if (field.fieldName === 'email' && userData.email) {
                    preFillData[field.fieldName] = userData.email;
                } else if (field.fieldName === 'batch' && userData.batch) {
                    preFillData[field.fieldName] = userData.batch;
                } else if (field.fieldName === 'department' && userData.department) {
                    preFillData[field.fieldName] = userData.department;
                } else if ((field.fieldName === 'name' || field.fieldName === 'fullName') && userData.name) {
                    preFillData[field.fieldName] = userData.name;
                }
            });

            setFormData(preFillData);
        }
    }, [userData, fields, isUserValid]);

    // Handle input change for text, email, number fields
    const handleInputChange = (fieldName, value, isReadOnly) => {
        if (isReadOnly) return; // Prevent changes to pre-filled fields

        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: null
            }));
        }
    };

    // Handle select change
    const handleSelectChange = (fieldName, value, isReadOnly) => {
        if (isReadOnly) return;

        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: null
            }));
        }
    };

    // Check if field should be read-only (pre-filled from userData)
    const isFieldReadOnly = (fieldName) => {
        const readOnlyFields = ['studentId', 'email', 'batch', 'department', 'name', 'fullName'];
        return userData && readOnlyFields.includes(fieldName);
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        fields.forEach(field => {
            if (field.isRequired && !formData[field.fieldName]) {
                newErrors[field.fieldName] = `${field.label} is required`;
            }

            if (field.fieldType === 'email' && formData[field.fieldName]) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData[field.fieldName])) {
                    newErrors[field.fieldName] = 'Please enter a valid email';
                }
            }

            if (field.fieldType === 'number' && formData[field.fieldName]) {
                if (isNaN(formData[field.fieldName])) {
                    newErrors[field.fieldName] = 'Please enter a valid number';
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submit button clicked');
        console.log('Current form data:', formData);
        console.log('Is submitting:', isSubmitting);

        if (!validateForm()) {
            console.log('Validation failed:', errors);
            return;
        }

        if (!userData) {
            console.error('No user data available');
            // alert('User session expired. Please log in again.');
            toastManager.add({
                title: "User session expired.",
                description: "Please log in again.",
                type: "error"
            })
            return;
        }

        console.log('Validation passed, submitting...');
        setIsSubmitting(true);

        try {
            // Include userData in submission for backend verification
            const submissionData = {
                ...formData,
                userData: {
                    studentId: userData.studentId,
                    email: userData.email,
                    status: userData.status
                },
                eventId: eventId
            };

            console.log('Calling onSubmit with:', submissionData);
            await onSubmit(submissionData);
            console.log('Submission completed successfully');
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
            console.log('Submission finished, button re-enabled');
        }
    };

    // Show not logged in message
    if (isNotLoggedIn) {
        return (
            <Alert variant="destructive" className="max-w-2xl mx-auto">
                <ShieldAlert className="h-5 w-5" />
                <AlertTitle className="text-lg font-semibold">Authentication Required</AlertTitle>
                <AlertDescription className="mt-2">
                    You must be logged in to register for this event. Please log in to continue.
                </AlertDescription>
                <Button className="mt-4" onClick={() => window.location.href = '/login'}>
                    Log In
                </Button>
            </Alert>
        );
    }

    // Show banned user message
    if (isBanned) {
        return (
            <Alert variant="destructive" className="max-w-2xl mx-auto">
                <ShieldAlert className="h-5 w-5" />
                <AlertTitle className="text-lg font-semibold">Account Suspended</AlertTitle>
                <AlertDescription className="mt-2">
                    Your account has been suspended and you cannot register for events at this time.
                    Please contact support for more information.
                </AlertDescription>
            </Alert>
        );
    }

    // Show loading state while checking registration
    if (checkingRegistration) {
        return (
            <div className="flex items-center justify-center py-10">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground">Checking registration status...</p>
                </div>
            </div>
        );
    }

    // Show already registered message
    if (hasRegistered) {
        return (
            <Alert className="max-w-2xl mx-auto border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertTitle className="text-lg font-semibold text-green-800 dark:text-green-200">
                    Already Registered
                </AlertTitle>
                <AlertDescription className="mt-2 text-green-700 dark:text-green-300">
                    You have already registered for this event. Only one registration per account is allowed.
                    Check your email for confirmation details.
                </AlertDescription>
            </Alert>
        );
    }

    // Render field based on type
    const renderField = (field) => {
        const hasError = errors[field.fieldName];
        const isReadOnly = isFieldReadOnly(field.fieldName);

        switch (field.fieldType) {
            case 'text':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.fieldName}>
                            {field.label}
                            {field.isRequired && <span className="text-destructive ml-1">*</span>}
                            {isReadOnly && <span className="text-xs text-muted-foreground ml-2">(Auto-filled)</span>}
                        </Label>
                        <Input
                            id={field.fieldName}
                            type="text"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            value={formData[field.fieldName] || ''}
                            onChange={(e) => handleInputChange(field.fieldName, e.target.value, isReadOnly)}
                            className={`${hasError ? 'border-destructive' : ''} ${isReadOnly ? 'bg-muted cursor-not-allowed' : ''}`}
                            readOnly={isReadOnly}
                        />
                        {hasError && (
                            <div className="flex items-center gap-1 text-sm text-destructive">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors[field.fieldName]}</span>
                            </div>
                        )}
                    </div>
                );

            case 'email':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.fieldName}>
                            {field.label}
                            {field.isRequired && <span className="text-destructive ml-1">*</span>}
                            {isReadOnly && <span className="text-xs text-muted-foreground ml-2">(Auto-filled)</span>}
                        </Label>
                        <Input
                            id={field.fieldName}
                            type="email"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            value={formData[field.fieldName] || ''}
                            onChange={(e) => handleInputChange(field.fieldName, e.target.value, isReadOnly)}
                            className={`${hasError ? 'border-destructive' : ''} ${isReadOnly ? 'bg-muted cursor-not-allowed' : ''}`}
                            readOnly={isReadOnly}
                        />
                        {hasError && (
                            <div className="flex items-center gap-1 text-sm text-destructive">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors[field.fieldName]}</span>
                            </div>
                        )}
                    </div>
                );

            case 'number':
                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.fieldName}>
                            {field.label}
                            {field.isRequired && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Input
                            id={field.fieldName}
                            type="number"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            value={formData[field.fieldName] || ''}
                            onChange={(e) => handleInputChange(field.fieldName, e.target.value, isReadOnly)}
                            className={`${hasError ? 'border-destructive' : ''} ${isReadOnly ? 'bg-muted cursor-not-allowed' : ''}`}
                            readOnly={isReadOnly}
                        />
                        {hasError && (
                            <div className="flex items-center gap-1 text-sm text-destructive">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors[field.fieldName]}</span>
                            </div>
                        )}
                    </div>
                );

            case 'select':
            case 'option': // ADD THIS LINE - Support both "select" and "option"
                const options = field.options ? field.options.split(',').map(opt => opt.trim()) : [];

                return (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.fieldName}>
                            {field.label}
                            {field.isRequired && <span className="text-destructive ml-1">*</span>}
                            {isReadOnly && <span className="text-xs text-muted-foreground ml-2">(Auto-filled)</span>}
                        </Label>
                        <Select
                            value={formData[field.fieldName] || ''}
                            onValueChange={(value) => handleSelectChange(field.fieldName, value, isReadOnly)}
                            disabled={isReadOnly}
                        >
                            <SelectTrigger className={`${hasError ? 'border-destructive' : ''} ${isReadOnly ? 'bg-muted cursor-not-allowed' : ''}`}>
                                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map((option, index) => (
                                    <SelectItem key={index} value={option}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {hasError && (
                            <div className="flex items-center gap-1 text-sm text-destructive">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors[field.fieldName]}</span>
                            </div>
                        )}
                    </div>
                );

            default:
                console.warn(`Unknown field type: ${field.fieldType} for field: ${field.fieldName}`);
                return null;
        }
    };

    // Show form for valid users
    return (
        <div className="space-y-6">
            {/* User Info Badge */}
            <Alert className="border-primary/50 bg-primary/5">
                <CheckCircle className="h-5 w-5 text-primary" />
                <AlertTitle className="text-sm font-semibold">Registering as:</AlertTitle>
                <AlertDescription className="mt-1 text-sm">
                    {userData.name} ({userData.studentId}) - {userData.email}
                </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map(field => renderField(field))}
                </div>

                <div className="flex flex-col gap-2">
                    <Button
                        type="submit"
                        className="w-full md:w-auto min-w-[200px] bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2 justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Submitting...
                            </span>
                        ) : (
                            submitButtonText
                        )}
                    </Button>

                    {isSubmitting && (
                        <p className="text-sm text-muted-foreground">
                            Please wait while we process your registration...
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default DynamicForm;