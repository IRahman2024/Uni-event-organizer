
'use client'
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/shadcn-components/ui/button"
import { Calendar } from "@/shadcn-components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn-components/ui/popover"
import React, { useState } from 'react';
import { Label } from "@/shadcn-components/ui/label";
import { Input } from "@/shadcn-components/ui/input"

const EditEvent = () => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState(undefined);
    return (
        <div>
            This is editing of event.
        </div>
    );
};

export default EditEvent;