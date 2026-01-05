"use client"

import { useMemo, useState } from "react"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    ChevronDownIcon,
    ChevronUpIcon,
    FilterIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/shadcn-components/ui/button"
import { Badge } from "@/shadcn-components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shadcn-components/ui/popover"
import { Checkbox } from "@/shadcn-components/ui/checkbox"
import { Label } from "@/shadcn-components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shadcn-components/ui/table"
import { Trefoil } from 'ldrs/react'
import 'ldrs/react/Trefoil.css'
import {
    AlertDialog,
    AlertDialogClose,
    AlertDialogDescription,
    AlertDialogPanel,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogPopup,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogCancel,
    AlertDialogAction
} from "@/shadcn-components/ui/alert-dialog"
import {
    Dialog,
    DialogDescription,
    DialogPanel,
    DialogFooter,
    DialogHeader,
    DialogPopup,
    DialogTitle,
    DialogTrigger,
    DialogContent,
    DialogClose,
} from "@/shadcn-components/ui/dialog"



const EVENT_TYPES = [
    "conference",
    "workshop",
    "meetup",
    "contests and competition",
    "hackathon",
    "tech fests",
    "cultural",
    "others",
]

/* ---------- Filter function for eventType ---------- */
const eventTypeFilterFn = (row, columnId, filterValue) => {
    if (!filterValue?.length) return true
    return filterValue.includes(row.getValue(columnId))
}

export default function MyEventsTable({
    registrations = [],
    onViewResponses,
    onCancelRegistration,
    loading
}) {
    const [sorting, setSorting] = useState([
        { id: "eventDate", desc: false },
    ])
    const [columnFilters, setColumnFilters] = useState([])
    const [selectedEventId, setSelectedEventId] = useState(null)
    const [selectedRegistration, setSelectedRegistration] = useState(null)

    /* ---------- Table Columns ---------- */
    const columns = [
        {
            header: "Event Name",
            accessorFn: (row) => row.event.eventTitle,
            id: "eventTitle",
            cell: ({ getValue }) => (
                <div className="font-medium">{getValue()}</div>
            ),
        },
        {
            header: "Event Date",
            accessorFn: (row) => row.event.eventDate,
            id: "eventDate",
            sortingFn: "datetime",
            cell: ({ getValue }) => {
                const date = new Date(getValue())
                return (
                    <span>
                        {date.toLocaleDateString()}{" "}
                        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                )
            },
        },
        {
            header: "Location",
            accessorFn: (row) => row.event.location,
            id: "location",
        },
        {
            header: "Event Type",
            accessorFn: (row) => row.event.eventType,
            id: "eventType",
            filterFn: eventTypeFilterFn,
            cell: ({ getValue }) => (
                <Badge variant="outline" className="capitalize">
                    {getValue()}
                </Badge>
            ),
        },
        {
            header: "Actions",
            id: "actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRegistration(row.original)}
                    >
                        View Responses
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setSelectedEventId(row.original.event.id)}
                    >
                        Cancel
                    </Button>
                </div>
            ),
        },
    ]

    const table = useReactTable({
        data: registrations,
        columns,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    })

    const selectedEventTypes =
        table.getColumn("eventType")?.getFilterValue() ?? []

    const handleEventTypeChange = (checked, value) => {
        const current = selectedEventTypes ?? []
        const next = checked
            ? [...current, value]
            : current.filter((v) => v !== value)

        table
            .getColumn("eventType")
            ?.setFilterValue(next.length ? next : undefined)
    }

    // if (loading) {
    //     return <div>
    //         Loading...
    //     </div>
    // }

    return (
        <div className="space-y-4">
            {/* ---------- Filter Bar ---------- */}
            <div className="flex justify-between">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">
                            <FilterIcon size={16} className="mr-2 opacity-60" />
                            Event Type
                            {selectedEventTypes.length > 0 && (
                                <span className="ml-2 text-xs">
                                    {selectedEventTypes.length}
                                </span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                        <div className="space-y-2">
                            {EVENT_TYPES.map((type) => (
                                <div key={type} className="flex items-center gap-2">
                                    <Checkbox
                                        checked={selectedEventTypes.includes(type)}
                                        onCheckedChange={(checked) =>
                                            handleEventTypeChange(checked, type)
                                        }
                                    />
                                    <Label className="capitalize">
                                        {type}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>

                </Popover>
            </div>

            {/* ---------- Table ---------- */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((group) => (
                            <TableRow key={group.id}>
                                {group.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        onClick={header.column.getToggleSortingHandler()}
                                        className={cn(
                                            header.column.getCanSort() && "cursor-pointer select-none"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: <ChevronUpIcon size={14} />,
                                                desc: <ChevronDownIcon size={14} />,
                                            }[header.column.getIsSorted()] ?? null}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {!loading ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    <Trefoil
                                        size="80"
                                        stroke="10"
                                        strokeLength="0.20"
                                        bgOpacity="0.4"
                                        speed="1.6"
                                        color="#fb3904ff"
                                    />
                                    <p>Loading...</p>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <AlertDialog
                open={!!selectedEventId}
                onOpenChange={() => setSelectedEventId(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Cancel registration?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            No
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={() => {
                                onCancelRegistration(selectedEventId)
                                setSelectedEventId(null)
                            }}
                        >
                            Yes, Cancel
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Dialog
                open={!!selectedRegistration}
                onOpenChange={() => setSelectedRegistration(null)}
            >
                <DialogPopup className="sm:max-w-lg" showCloseButton={false}>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedRegistration?.event.eventTitle}
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Submitted form responses
                        </p>
                    </DialogHeader>

                    <DialogPanel>
                        <div className="space-y-3 text-sm">
                            {selectedRegistration &&
                                Object.entries(selectedRegistration.formData).map(
                                    ([key, value]) => {
                                        // skip internal / noisy fields
                                        if (key === "eventId" || key === "userData") return null;

                                        return (
                                            <div
                                                key={key}
                                                className="flex items-start justify-between gap-4 border-b pb-2 last:border-b-0"
                                            >
                                                <span className="font-medium capitalize">
                                                    {key.replace(/([A-Z])/g, " $1")}
                                                </span>

                                                <span className="text-muted-foreground text-right">
                                                    {String(value)}
                                                </span>
                                            </div>
                                        );
                                    }
                                )}
                        </div>
                    </DialogPanel>

                    <DialogFooter>
                        <DialogClose render={<Button variant="ghost" />}>
                            Close
                        </DialogClose>
                    </DialogFooter>
                </DialogPopup>
            </Dialog>

        </div>
    )
}