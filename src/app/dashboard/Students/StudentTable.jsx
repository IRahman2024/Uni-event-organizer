"use client"

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
    ListFilterIcon,
    PlusIcon,
    TrashIcon,
    FilterIcon,
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

import { Trefoil } from 'ldrs/react'
import 'ldrs/react/Trefoil.css'
import { Badge } from "@/shadcn-components/ui/badge"
import { Helix } from 'ldrs/react'
import 'ldrs/react/Helix.css'


// Custom filter function for multi-column searching (name and email)
const multiColumnFilterFn = (row, columnId, filterValue) => {
    const searchableRowContent =
        `${row.original.name} ${row.original.email} ${row.original.studentId}`.toLowerCase()
    const searchTerm = (filterValue ?? "").toLowerCase()
    return searchableRowContent.includes(searchTerm)
}

// Filter function for department
const departmentFilterFn = (row, columnId, filterValue) => {
    if (!filterValue?.length) return true
    const department = row.getValue(columnId)
    return filterValue.includes(department)
}

// Filter function for batch
const batchFilterFn = (row, columnId, filterValue) => {
    if (!filterValue?.length) return true
    const batch = row.getValue(columnId)
    return filterValue.includes(batch)
}

// Filter function for status
const statusFilterFn = (row, columnId, filterValue) => {
    if (!filterValue?.length) return true
    const status = row.getValue(columnId)
    return filterValue.includes(status)
}

export default function StudentTable({
    students = [],
    onAddStudent,
    onEditStudent,
    onDeleteStudent,
    onDeleteMultiple,
    isLoading,
    isUpdating,
    onUpdateStatus
}) {
    const id = useId()
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [sorting, setSorting] = useState([
        {
            id: "name",
            desc: false,
        },
    ])
    const [rowSelection, setRowSelection] = useState({})
    const inputRef = useRef(null)

    const columns = [
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
            header: "Student ID",
            accessorKey: "studentId",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("studentId")}</div>
            ),
            size: 120,
            enableHiding: false,
        },
        {
            header: "Name",
            accessorKey: "name",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("name")}</div>
            ),
            size: 180,
            filterFn: multiColumnFilterFn,
            enableHiding: false,
        },
        {
            header: "Email",
            accessorKey: "email",
            cell: ({ row }) => (
                <div className="break-all">{row.getValue("email")}</div>
            ),
            size: 240,
        },
        {
            header: "Department",
            accessorKey: "department",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("department")}</div>
            ),
            size: 120,
            filterFn: departmentFilterFn,
        },
        {
            header: "Batch",
            accessorKey: "batch",
            cell: ({ row }) => (
                <div>{row.getValue("batch")}</div>
            ),
            size: 80,
            filterFn: batchFilterFn,
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => (
                <Badge
                    className={cn(
                        row.getValue("status") === "active"
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    )}
                >
                    {row.getValue("status")}
                </Badge>
            ),
            size: 100,
            filterFn: statusFilterFn,
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }) => (
                <RowActions
                    row={row}
                    onEdit={onEditStudent}
                    onDelete={onDeleteStudent}
                    onUpdateStatus={onUpdateStatus}
                />
            ),
            size: 60,
            enableHiding: false,
        },
    ]

    const handleDeleteRows = () => {
        const selectedRows = table.getSelectedRowModel().rows
        const selectedIds = selectedRows.map(row => row.original.id)
        if (onDeleteMultiple) {
            onDeleteMultiple(selectedIds)
        }
        table.resetRowSelection()
    }

    const table = useReactTable({
        data: students,
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
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            pagination,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // Get unique department values
    const uniqueDepartments = useMemo(() => {
        const departmentColumn = table.getColumn("department")
        if (!departmentColumn) return []
        const values = Array.from(departmentColumn.getFacetedUniqueValues().keys())
        return values.sort()
    }, [table.getColumn("department")?.getFacetedUniqueValues()])

    // Get counts for each department
    const departmentCounts = useMemo(() => {
        const departmentColumn = table.getColumn("department")
        if (!departmentColumn) return new Map()
        return departmentColumn.getFacetedUniqueValues()
    }, [table.getColumn("department")?.getFacetedUniqueValues()])

    const selectedDepartments = useMemo(() => {
        const filterValue = table.getColumn("department")?.getFilterValue()
        return filterValue ?? []
    }, [table.getColumn("department")?.getFilterValue()])

    const handleDepartmentChange = (checked, value) => {
        const filterValue = table.getColumn("department")?.getFilterValue()
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
            .getColumn("department")
            ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
    }

    // Get unique batch values
    const uniqueBatches = useMemo(() => {
        const batchColumn = table.getColumn("batch")
        if (!batchColumn) return []
        const values = Array.from(batchColumn.getFacetedUniqueValues().keys())
        return values.sort((a, b) => a - b)
    }, [table.getColumn("batch")?.getFacetedUniqueValues()])

    // Get counts for each batch
    const batchCounts = useMemo(() => {
        const batchColumn = table.getColumn("batch")
        if (!batchColumn) return new Map()
        return batchColumn.getFacetedUniqueValues()
    }, [table.getColumn("batch")?.getFacetedUniqueValues()])

    const selectedBatches = useMemo(() => {
        const filterValue = table.getColumn("batch")?.getFilterValue()
        return filterValue ?? []
    }, [table.getColumn("batch")?.getFilterValue()])

    const handleBatchChange = (checked, value) => {
        const filterValue = table.getColumn("batch")?.getFilterValue()
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
            .getColumn("batch")
            ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
    }

    // Get unique status values
    const uniqueStatuses = useMemo(() => {
        const statusColumn = table.getColumn("status")
        if (!statusColumn) return []
        const values = Array.from(statusColumn.getFacetedUniqueValues().keys())
        return values.sort()
    }, [table.getColumn("status")?.getFacetedUniqueValues()])

    // Get counts for each status
    const statusCounts = useMemo(() => {
        const statusColumn = table.getColumn("status")
        if (!statusColumn) return new Map()
        return statusColumn.getFacetedUniqueValues()
    }, [table.getColumn("status")?.getFacetedUniqueValues()])

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

    return (
        <>
            <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        {/* Filter by name, email, or student ID */}
                        <div className="relative">
                            <Input
                                id={`${id}-input`}
                                ref={inputRef}
                                className={cn(
                                    "peer min-w-60 ps-9",
                                    Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9"
                                )}
                                value={
                                    (table.getColumn("name")?.getFilterValue() ?? "")
                                }
                                onChange={(e) =>
                                    table.getColumn("name")?.setFilterValue(e.target.value)
                                }
                                placeholder="Search by name, email, or ID..."
                                type="text"
                                aria-label="Filter by name, email, or student ID"
                            />
                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                <ListFilterIcon size={16} aria-hidden="true" />
                            </div>
                            {Boolean(table.getColumn("name")?.getFilterValue()) && (
                                <button
                                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                    aria-label="Clear filter"
                                    onClick={() => {
                                        table.getColumn("name")?.setFilterValue("")
                                        if (inputRef.current) {
                                            inputRef.current.focus()
                                        }
                                    }}
                                >
                                    <CircleXIcon size={16} aria-hidden="true" />
                                </button>
                            )}
                        </div>

                        {/* Filter by department */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
                                    <FilterIcon
                                        className="-ms-1 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    Department
                                    {selectedDepartments.length > 0 && (
                                        <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                                            {selectedDepartments.length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto min-w-36 p-3" align="start">
                                <div className="space-y-3">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Filter by Department
                                    </div>
                                    <div className="space-y-3">
                                        {uniqueDepartments.map((value, i) => (
                                            <div key={value} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`${id}-dept-${i}`}
                                                    checked={selectedDepartments.includes(value)}
                                                    onCheckedChange={(checked) =>
                                                        handleDepartmentChange(checked, value)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`${id}-dept-${i}`}
                                                    className="flex grow justify-between gap-2 font-normal"
                                                >
                                                    {value}{" "}
                                                    <span className="ms-2 text-xs text-muted-foreground">
                                                        {departmentCounts.get(value)}
                                                    </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Filter by batch */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
                                    <FilterIcon
                                        className="-ms-1 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    Batch
                                    {selectedBatches.length > 0 && (
                                        <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                                            {selectedBatches.length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto min-w-36 p-3" align="start">
                                <div className="space-y-3">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Filter by Batch
                                    </div>
                                    <div className="space-y-3">
                                        {uniqueBatches.map((value, i) => (
                                            <div key={value} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`${id}-batch-${i}`}
                                                    checked={selectedBatches.includes(value)}
                                                    onCheckedChange={(checked) =>
                                                        handleBatchChange(checked, value)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`${id}-batch-${i}`}
                                                    className="flex grow justify-between gap-2 font-normal"
                                                >
                                                    Batch {value}{" "}
                                                    <span className="ms-2 text-xs text-muted-foreground">
                                                        {batchCounts.get(value)}
                                                    </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Filter by status */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
                                    <FilterIcon
                                        className="-ms-1 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    Status
                                    {selectedStatuses.length > 0 && (
                                        <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
                                            {selectedStatuses.length}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto min-w-36 p-3" align="start">
                                <div className="space-y-3">
                                    <div className="text-xs font-medium text-muted-foreground">
                                        Filter by Status
                                    </div>
                                    <div className="space-y-3">
                                        {uniqueStatuses.map((value, i) => (
                                            <div key={value} className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`${id}-status-${i}`}
                                                    checked={selectedStatuses.includes(value)}
                                                    onCheckedChange={(checked) =>
                                                        handleStatusChange(checked, value)
                                                    }
                                                />
                                                <Label
                                                    htmlFor={`${id}-status-${i}`}
                                                    className="flex grow justify-between gap-2 font-normal capitalize"
                                                >
                                                    {value}{" "}
                                                    <span className="ms-2 text-xs text-muted-foreground">
                                                        {statusCounts.get(value)}
                                                    </span>
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>

                        {/* Toggle columns visibility */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Columns3Icon
                                        className="-ms-1 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
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
                    <div className="flex items-center gap-3">
                        {/* Delete button */}
                        {table.getSelectedRowModel().rows.length > 0 && (
                            <div className="flex items-center gap-3">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="ml-auto" variant="outline">
                                            <TrashIcon
                                                className="-ms-1 opacity-60"
                                                size={16}
                                                aria-hidden="true"
                                            />
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
                                                        ? "student"
                                                        : "students"}
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
                            </div>
                        )}
                        {/* Add student button */}
                        {onAddStudent && (
                            <Button className="ml-auto" onClick={onAddStudent}>
                                <PlusIcon
                                    className="-ms-1 opacity-60"
                                    size={16}
                                    aria-hidden="true"
                                />
                                Add Student
                            </Button>
                        )}
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
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        <Trefoil
                                            size="75"
                                            stroke="9"
                                            strokeLength="0.20"
                                            bgOpacity="0.25"
                                            speed="1.9"
                                            color='#0ee475ff'
                                        />
                                        <p className="mt-5">Loading Students...</p>
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
                                        No students found.
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
                                    Math.max(
                                        table.getState().pagination.pageIndex *
                                        table.getState().pagination.pageSize +
                                        table.getState().pagination.pageSize,
                                        0
                                    ),
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
                                {/* First page button */}
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
                                {/* Previous page button */}
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
                                {/* Next page button */}
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
                                {/* Last page button */}
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
            {isUpdating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center gap-4 rounded-lg bg-background p-6 shadow-lg">
                        <Helix
                            size="79"
                            speed="3.7"
                            color='#0df22cff'
                        ></Helix>
                        <p className="text-lg font-medium text-center">Please wait... <br /> Updating student status…</p>
                    </div>
                </div>
            )}
        </>
    )
}

function RowActions({ row, onEdit, onDelete, onUpdateStatus }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="flex justify-end">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="shadow-none"
                        aria-label="Actions"
                    >
                        <EllipsisIcon size={16} aria-hidden="true" />
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => onEdit?.(row.original)}>
                        <span>Edit</span>
                        <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <span>View Details</span>
                        <DropdownMenuShortcut>⌘V</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onUpdateStatus?.(
                            row.original.id,
                            row.original.status === "active" ? "banned" : "active"
                        )}
                    >
                        <span>{row.original.status === "active" ? "Ban Student" : "Activate Student"}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete?.(row.original.id)}
                >
                    <span>Delete</span>
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}