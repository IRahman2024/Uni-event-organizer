"use client";
import { useId, useMemo, useRef, useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    ChevronDownIcon,
    ChevronFirstIcon,
    ChevronLastIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CircleAlertIcon,
    CircleXIcon,
    Columns3Icon,
    EllipsisIcon,
    FilterIcon,
    ListFilterIcon,
    CalendarIcon,
    XIcon,
    TrashIcon,
    PlusIcon,
    Filter,
    FilterXIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shadcn-components/ui/alert-dialog"
import { Badge } from "@/shadcn-components/ui/badge"
import { Button } from "@/shadcn-components/ui/button"
import { Checkbox } from "@/shadcn-components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/shadcn-components/ui/dropdown-menu"
import { Input } from "@/shadcn-components/ui/input"
import { Label } from "@/shadcn-components/ui/label"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/shadcn-components/ui/pagination"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn-components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn-components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shadcn-components/ui/table"
import { Calendar } from "@/shadcn-components/ui/calendar"
import Link from "next/link";

import { Trefoil } from 'ldrs/react'
import 'ldrs/react/Trefoil.css'

import { helix } from 'ldrs'
helix.register();

// Event types as defined
const EVENT_TYPES = [
    "conference",
    "workshop",
    "meetup",
    "competition",
    "hackathon",
    "competitive programming",
    "cultural",
    "others"
]

// Event status types
const EVENT_STATUS = [
    "active",
    "completed",
    "canceled",
    "postponed"
]

// Custom filter function for date range
const dateRangeFilterFn = (row, columnId, filterValue) => {
    if (!filterValue?.from && !filterValue?.to) return true

    const cellDate = new Date(row.getValue(columnId))
    const fromDate = filterValue.from ? new Date(filterValue.from) : null
    const toDate = filterValue.to ? new Date(filterValue.to) : null

    if (fromDate) {
        fromDate.setHours(0, 0, 0, 0)
        if (cellDate < fromDate) return false
    }

    if (toDate) {
        toDate.setHours(23, 59, 59, 999)
        if (cellDate > toDate) return false
    }

    return true
}

// Event type filter function
const eventTypeFilterFn = (row, columnId, filterValue) => {
    if (!filterValue?.length) return true
    const eventType = row.getValue(columnId)
    return filterValue.includes(eventType)
}

// Status filter function
const statusFilterFn = (row, columnId, filterValue) => {
    if (!filterValue?.length) return true
    const status = row.getValue(columnId)
    // Handle null status as "postponed"
    const normalizedStatus = status === null ? "postponed" : status
    return filterValue.includes(normalizedStatus)
}

// Format date helper
const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    })
}

// Create columns function
const createColumns = (onEdit, onDelete, onView, onStatusChange, isLoading) => [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        size: 28,
        enableSorting: false,
        enableHiding: false,
    },
    {
        header: "Event Title",
        accessorKey: "eventTitle",
        cell: ({ row }) => (
            <div className="font-medium">{row.getValue("eventTitle")}</div>
        ),
        size: 200,
        filterFn: "includesString",
        enableHiding: false,
    },
    {
        header: "Location",
        accessorKey: "location",
        size: 150,
    },
    {
        header: "Event Type",
        accessorKey: "eventType",
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.getValue("eventType")}
            </Badge>
        ),
        size: 150,
        filterFn: eventTypeFilterFn,
    },
    {
        header: "Capacity",
        accessorKey: "capacity",
        cell: ({ row }) => {
            const audience = row.original.audience || 0
            const capacity = row.getValue("capacity")
            const percentage = (audience / capacity) * 100

            return (
                <div className="flex items-center gap-2">
                    <span className="text-sm">
                        {audience} / {capacity}
                    </span>
                    <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                        <div
                            className={cn(
                                "h-full transition-all",
                                percentage < 50 ? "bg-green-500" :
                                    percentage < 80 ? "bg-yellow-500" : "bg-red-500"
                            )}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            )
        },
        size: 150,
    },
    {
        header: "Event Date",
        accessorKey: "eventDate",
        cell: ({ row }) => formatDate(row.getValue("eventDate")),
        size: 130,
        filterFn: dateRangeFilterFn,
    },
    {
        header: "Deadline",
        accessorKey: "eventDeadline",
        cell: ({ row }) => {
            const deadline = new Date(row.getValue("eventDeadline"))
            const now = new Date()
            const isExpired = deadline < now

            return (
                <div className={cn(isExpired && "text-red-500")}>
                    {formatDate(row.getValue("eventDeadline"))}
                </div>
            )
        },
        size: 130,
        filterFn: dateRangeFilterFn,
    },
    {
        header: "Price",
        accessorKey: "price",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"))
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "BDT",
            }).format(amount)
            return formatted
        },
        size: 100,
    },
    {
        header: <div className="ml-8">Status</div>,
        accessorKey: "status",
        cell: ({ row }) => {
            const status = row.getValue("status")

            // Handle null status
            if (status === null) {
                return <Badge className=" bg-yellow-500 text-white text-[10px] hover:bg-yellow-600 pl-2 ml-8">Postponed</Badge>
            }

            // Handle different statuses
            const statusConfig = {
                active: { className: "bg-green-500 text-white text-[10px] hover:bg-green-600 pl-2 ml-8", label: "Active" },
                completed: { className: "bg-blue-500 text-white text-[10px] hover:bg-blue-600 pl-2 ml-8", label: "Completed" },
                canceled: { className: "bg-red-500 text-white text-[10px] hover:bg-red-600 pl-2 ml-8", label: "Canceled" },
                postponed: { className: "bg-yellow-500 text-white text-[10px] hover:bg-yellow-600 pl-2 ml-8", label: "Postponed" }
            }

            const config = statusConfig[status?.toLowerCase()] || statusConfig.postponed

            return (
                <div className="flex items-center">
                    <Badge className={config.className}>
                        {config.label}
                    </Badge>
                </div>
            )
        },
        size: 120,
        filterFn: statusFilterFn,
    },
    {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
            <RowActions
                row={row}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                onStatusChange={onStatusChange}
            />
        ),
        size: 60,
        enableHiding: false,
    },
]

// Main Component
export default function EventTable({
    data = [],
    onEdit,
    onDelete,
    onView,
    onAddEvent,
    onStatusChange,
    isLoading = false,
    isUpdating = false,
    isDeleting = false
}) {
    const id = useId()
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const inputRef = useRef(null)
    const [sorting, setSorting] = useState([
        {
            id: "eventTitle",
            desc: false,
        },
    ])

    // Date range states
    const [openEventDate, setOpenEventDate] = useState(false)
    const [openDeadlineDate, setOpenDeadlineDate] = useState(false)
    const [eventDateRange, setEventDateRange] = useState({ from: null, to: null })
    const [deadlineDateRange, setDeadlineDateRange] = useState({ from: null, to: null })
    // const [isDeleting, setIsDeleting] = useState(false)
    // const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusChangeInternal = async (eventId, newStatus) => {

        // console.log(eventId, newStatus);

        // setIsUpdating(true);

        try {
            const statUpdate = await onStatusChange?.(eventId, newStatus);
            console.log('statUpdate: ', statUpdate);
            
        }
        catch (error) {
            console.error("Status update failed:", error)
        }
        finally {
            // setIsUpdating(false);
        }
    }

    const columns = useMemo(() => createColumns(onEdit, onDelete, onView, handleStatusChangeInternal ), [onEdit, onDelete, onView, onStatusChange ])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        enableSortingRemoval: false,
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        state: {
            sorting,
            pagination,
            columnFilters,
            columnVisibility,
        },
    })

    // Status filter state
    const selectedStatuses = useMemo(() => {
        const filterValue = table.getColumn("status")?.getFilterValue()
        return filterValue ?? []
    }, [table.getColumn("status")?.getFilterValue()])

    const handleStatusChange = (checked, value) => {
        const filterValue = table.getColumn("status")?.getFilterValue()
        const newFilterValue = filterValue ? [...filterValue] : []

        if (checked) {
            newFilterValue.push(value)
        } else {
            const index = newFilterValue.indexOf(value)
            if (index > -1) {
                newFilterValue.splice(index, 1)
            }
        }

        table
            .getColumn("status")
            ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
    }

    const handleDeleteRows = async () => {
        const selectedRows = table.getSelectedRowModel().rows
        const selectedIds = selectedRows.map(row => row.original.id)

        if (onDelete) {
            // setIsDeleting(true)  // Show loading dialog
            try {
                await onDelete(selectedIds)  // Wait for delete to complete
                table.resetRowSelection()
            } catch (error) {
                console.error("Delete failed:", error)
            } finally {
                // setIsDeleting(false)  // Hide loading dialog
            }
        }
    }

    // Get selected event types
    const selectedEventTypes = useMemo(() => {
        const filterValue = table.getColumn("eventType")?.getFilterValue()
        return filterValue ?? []
    }, [table.getColumn("eventType")?.getFilterValue()])

    const handleEventTypeChange = (checked, value) => {
        const filterValue = table.getColumn("eventType")?.getFilterValue()
        const newFilterValue = filterValue ? [...filterValue] : []

        if (checked) {
            newFilterValue.push(value)
        } else {
            const index = newFilterValue.indexOf(value)
            if (index > -1) {
                newFilterValue.splice(index, 1)
            }
        }

        table
            .getColumn("eventType")
            ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
    }

    // Handle event date range
    const handleEventDateSelect = (range) => {
        setEventDateRange(range)
        table.getColumn("eventDate")?.setFilterValue(range)
    }

    // Handle deadline date range
    const handleDeadlineDateSelect = (range) => {
        setDeadlineDateRange(range)
        table.getColumn("eventDeadline")?.setFilterValue(range)
    }

    // Clear all filters
    const clearAllFilters = () => {
        table.resetColumnFilters()
        setEventDateRange({ from: null, to: null })
        setDeadlineDateRange({ from: null, to: null })
    }

    const hasActiveFilters = columnFilters.length > 0

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search by title */}
                    <div className="relative">
                        <Input
                            id={`${id}-input`}
                            ref={inputRef}
                            className={cn(
                                "peer min-w-60 ps-9",
                                Boolean(table.getColumn("eventTitle")?.getFilterValue()) && "pe-9"
                            )}
                            value={table.getColumn("eventTitle")?.getFilterValue() ?? ""}
                            onChange={(e) =>
                                table.getColumn("eventTitle")?.setFilterValue(e.target.value)
                            }
                            placeholder="Search by event title..."
                            type="text"
                            aria-label="Search by event title"
                        />
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                            <ListFilterIcon size={16} aria-hidden="true" />
                        </div>
                        {Boolean(table.getColumn("eventTitle")?.getFilterValue()) && (
                            <button
                                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                aria-label="Clear search"
                                onClick={() => {
                                    table.getColumn("eventTitle")?.setFilterValue("")
                                    if (inputRef.current) {
                                        inputRef.current.focus()
                                    }
                                }}
                            >
                                <CircleXIcon size={16} aria-hidden="true" />
                            </button>
                        )}
                    </div>

                    {/* Event Type Filter */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                                Event Type
                                {selectedEventTypes.length > 0 && (
                                    <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                                        {selectedEventTypes.length}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto min-w-48 p-3" align="start">
                            <div className="space-y-3">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Filter by Event Type
                                </div>
                                <div className="space-y-3">
                                    {EVENT_TYPES.map((type, i) => (
                                        <div key={type} className="flex items-center gap-2">
                                            <Checkbox
                                                id={`${id}-type-${i}`}
                                                checked={selectedEventTypes.includes(type)}
                                                onCheckedChange={(checked) =>
                                                    handleEventTypeChange(checked, type)
                                                }
                                            />
                                            <Label
                                                htmlFor={`${id}-type-${i}`}
                                                className="flex grow justify-between gap-2 font-normal capitalize cursor-pointer"
                                            >
                                                {type}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Status Filter */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">
                                <FilterXIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                                Status
                                {selectedStatuses.length > 0 && (
                                    <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                                        {selectedStatuses.length}
                                    </span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto min-w-48 p-3" align="start">
                            <div className="space-y-3">
                                <div className="text-xs font-medium text-muted-foreground">
                                    Filter by Status
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id={`${id}-status-active`}
                                            checked={selectedStatuses.includes("active")}
                                            onCheckedChange={(checked) => handleStatusChange(checked, "active")}
                                        />
                                        <Label
                                            htmlFor={`${id}-status-active`}
                                            className="flex grow items-center gap-2 font-normal cursor-pointer"
                                        >
                                            <Badge className="bg-green-500 text-white text-xs px-2 py-0">Active</Badge>
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id={`${id}-status-completed`}
                                            checked={selectedStatuses.includes("completed")}
                                            onCheckedChange={(checked) => handleStatusChange(checked, "completed")}
                                        />
                                        <Label
                                            htmlFor={`${id}-status-completed`}
                                            className="flex grow items-center gap-2 font-normal cursor-pointer"
                                        >
                                            <Badge className="bg-blue-500 text-white text-xs px-2 py-0">Completed</Badge>
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id={`${id}-status-canceled`}
                                            checked={selectedStatuses.includes("canceled")}
                                            onCheckedChange={(checked) => handleStatusChange(checked, "canceled")}
                                        />
                                        <Label
                                            htmlFor={`${id}-status-canceled`}
                                            className="flex grow items-center gap-2 font-normal cursor-pointer"
                                        >
                                            <Badge className="bg-red-500 text-white text-xs px-2 py-0">Canceled</Badge>
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id={`${id}-status-postponed`}
                                            checked={selectedStatuses.includes("postponed")}
                                            onCheckedChange={(checked) => handleStatusChange(checked, "postponed")}
                                        />
                                        <Label
                                            htmlFor={`${id}-status-postponed`}
                                            className="flex grow items-center gap-2 font-normal cursor-pointer"
                                        >
                                            <Badge className="bg-yellow-500 text-white text-xs px-2 py-0">Postponed/Null</Badge>
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Event Date Range Filter */}
                    <Popover open={openEventDate} onOpenChange={setOpenEventDate}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-between">
                                <CalendarIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                                Event Date
                                {(eventDateRange.from || eventDateRange.to) && (
                                    <Badge variant="secondary" className="-me-1 h-5 text-[0.625rem]">
                                        Active
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="range"
                                selected={eventDateRange}
                                onSelect={handleEventDateSelect}
                                captionLayout="dropdown"
                                numberOfMonths={2}
                            />
                            {(eventDateRange.from || eventDateRange.to) && (
                                <div className="p-3 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => {
                                            setEventDateRange({ from: null, to: null })
                                            table.getColumn("eventDate")?.setFilterValue(undefined)
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>

                    {/* Deadline Range Filter */}
                    <Popover open={openDeadlineDate} onOpenChange={setOpenDeadlineDate}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="justify-between">
                                <CalendarIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                                Deadline
                                {(deadlineDateRange.from || deadlineDateRange.to) && (
                                    <Badge variant="secondary" className="-me-1 h-5 text-[0.625rem]">
                                        Active
                                    </Badge>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="range"
                                selected={deadlineDateRange}
                                onSelect={handleDeadlineDateSelect}
                                captionLayout="dropdown"
                                numberOfMonths={2}
                            />
                            {(deadlineDateRange.from || deadlineDateRange.to) && (
                                <div className="p-3 border-t">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => {
                                            setDeadlineDateRange({ from: null, to: null })
                                            table.getColumn("eventDeadline")?.setFilterValue(undefined)
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>

                    {/* Clear All Filters */}
                    {hasActiveFilters && (
                        <Button variant="ghost" onClick={clearAllFilters}>
                            <XIcon className="-ms-1" size={16} aria-hidden="true" />
                            Clear Filters
                        </Button>
                    )}

                    {/* Toggle columns visibility */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <Columns3Icon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                            onSelect={(event) => event.preventDefault()}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {/* delete dialogs */}
                <div className="flex items-center gap-3">
                    {/* Delete button */}
                    {table.getSelectedRowModel().rows.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline">
                                    <TrashIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                                    Delete
                                    <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                                        {table.getSelectedRowModel().rows.length}
                                    </span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                                    <div
                                        className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                                        aria-hidden="true"
                                    >
                                        <CircleAlertIcon className="opacity-80" size={16} />
                                    </div>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete{" "}
                                            {table.getSelectedRowModel().rows.length} selected{" "}
                                            {table.getSelectedRowModel().rows.length === 1
                                                ? "event"
                                                : "events"}
                                            .
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteRows}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    <AlertDialog open={isDeleting}>
                        <AlertDialogContent>
                            <div className="flex flex-col gap-4 items-center justify-center py-4">
                                <l-helix
                                    size="79"
                                    speed="3.7"
                                    color='#f20d0d'
                                ></l-helix>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center">
                                        Deleting Events...
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-center">
                                        Please wait while we delete the selected events.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog open={isUpdating}>
                        <AlertDialogContent>
                            <div className="flex flex-col gap-4 items-center justify-center py-4">
                                <l-helix
                                    size="79"
                                    speed="3.7"
                                    color='#0df22cff'
                                ></l-helix>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-center">
                                        Updating...
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-center">
                                        Please wait while updating.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Add event button */}
                    <Link href={'http://localhost:3000/dashboard/Events/create'}>
                        <Button>
                            <PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                            Add Event
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border bg-background">
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: `${header.getSize()}px` }}
                                            className="h-11"
                                        >
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <div
                                                    className={cn(
                                                        header.column.getCanSort() &&
                                                        "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    onKeyDown={(e) => {
                                                        if (
                                                            header.column.getCanSort() &&
                                                            (e.key === "Enter" || e.key === " ")
                                                        ) {
                                                            e.preventDefault()
                                                            header.column.getToggleSortingHandler()?.(e)
                                                        }
                                                    }}
                                                    tabIndex={header.column.getCanSort() ? 0 : undefined}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: (
                                                            <ChevronUpIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                        desc: (
                                                            <ChevronDownIcon
                                                                className="shrink-0 opacity-60"
                                                                size={16}
                                                                aria-hidden="true"
                                                            />
                                                        ),
                                                    }[header.column.getIsSorted()] ?? null}
                                                </div>
                                            ) : (
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center max-w-full">
                                    {/* table loading */}
                                    <Trefoil
                                        size="75"
                                        stroke="9"
                                        strokeLength="0.28"
                                        bgOpacity="0.25"
                                        speed="1.6"
                                        color='#0ee475ff'
                                    />
                                    <p>Loading events...</p>
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="last:py-0">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No events found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-8">
                {/* Results per page */}
                <div className="flex items-center gap-3">
                    <Label htmlFor={id} className="max-sm:sr-only">
                        Rows per page
                    </Label>
                    <Select
                        value={table.getState().pagination.pageSize.toString()}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger id={id} className="w-fit whitespace-nowrap">
                            <SelectValue placeholder="Select number of results" />
                        </SelectTrigger>
                        <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                            {[5, 10, 25, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={pageSize.toString()}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Page number information */}
                <div className="flex grow justify-end text-sm whitespace-nowrap text-muted-foreground">
                    <p
                        className="text-sm whitespace-nowrap text-muted-foreground"
                        aria-live="polite"
                    >
                        <span className="text-foreground">
                            {table.getState().pagination.pageIndex *
                                table.getState().pagination.pageSize +
                                1}
                            -
                            {Math.min(
                                table.getState().pagination.pageIndex *
                                table.getState().pagination.pageSize +
                                table.getState().pagination.pageSize,
                                table.getRowCount()
                            )}
                        </span>{" "}
                        of{" "}
                        <span className="text-foreground">
                            {table.getRowCount().toString()}
                        </span>
                    </p>
                </div>

                {/* Pagination buttons */}
                <div>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.firstPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to first page"
                                >
                                    <ChevronFirstIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    aria-label="Go to previous page"
                                >
                                    <ChevronLeftIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to next page"
                                >
                                    <ChevronRightIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="disabled:pointer-events-none disabled:opacity-50"
                                    onClick={() => table.lastPage()}
                                    disabled={!table.getCanNextPage()}
                                    aria-label="Go to last page"
                                >
                                    <ChevronLastIcon size={16} aria-hidden="true" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

// Row Actions Component
function RowActions({ row, onEdit, onDelete, onView, onStatusChange }) {
    const event = row.original

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex justify-end">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="shadow-none"
                        aria-label="Event actions"
                    >
                        <EllipsisIcon size={16} aria-hidden="true" />
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => onView?.(event.id)}>
                        <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit?.(event.id)}>
                        <span>Edit Event</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>Duplicate</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => onStatusChange?.(event.id, "active")}>
                                    <Badge className="bg-green-500 text-white text-xs">Active</Badge>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onStatusChange?.(event.id, "completed")}>
                                    <Badge className="bg-blue-500 text-white text-xs">Completed</Badge>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onStatusChange?.(event.id, "canceled")}>
                                    <Badge className="bg-red-500 text-white text-xs">Canceled</Badge>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onStatusChange?.(event.id, "postponed")}>
                                    <Badge className="bg-yellow-500 text-white text-xs">Postponed</Badge>
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete?.([event.id])}
                >
                    <span>Delete Event</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
// { <DropdownMenuGroup>
//           <DropdownMenuItem>
//             <span>View Registrations</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <span>Export Data</span>
//           </DropdownMenuItem>
//         </DropdownMenuGroup>
//         <DropdownMenuSeparator />
// }