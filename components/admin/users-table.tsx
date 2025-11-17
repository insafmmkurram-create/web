"use client"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
  RowSelectionState,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChangeStatusDialog } from "@/components/admin/change-status-dialog"
import { EditUserDialog } from "@/components/admin/edit-user-dialog"
import { AddSubadminDialog } from "@/components/admin/add-subadmin-dialog"
import { AddUserDialog } from "@/components/admin/add-user-dialog"
import { User } from "@/lib/firebase-admin"
import { useCurrentUserRole } from "@/hooks/use-current-user-role"
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2, FileCheck, Plus } from "lucide-react"

interface UsersTableProps {
  data: User[]
  onRefresh?: () => void
}

export function UsersTable({ data, onRefresh }: UsersTableProps) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addSubadminDialogOpen, setAddSubadminDialogOpen] = useState(false)
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false)
  const { userRole } = useCurrentUserRole()
  
  const isAdmin = userRole === "admin"

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
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
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name") || "N/A"}</div>,
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("email") || "N/A"}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => {
        // Get phone from mobile field (from registrations) or phone field
        const phone = row.original.mobile || row.original.phone || "N/A"
        return <div>{phone}</div>
      },
    },
    {
      accessorKey: "cnic",
      header: "NIC",
      cell: ({ row }) => {
        const cnic = row.getValue("cnic") as string
        return <div>{cnic && cnic !== "N/A" ? cnic : "N/A"}</div>
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        const statusColors = {
          pending: "bg-amber-100 text-amber-800",
          accepted: "bg-green-100 text-green-800",
          rejected: "bg-red-100 text-red-800",
        }
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"
            }`}
          >
            {status.toUpperCase()}
          </span>
        )
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {role?.toUpperCase() || "USER"}
          </span>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Registration Date",
      cell: ({ row }) => {
        const date = row.getValue("createdAt")
        if (!date) return "N/A"
        try {
          const dateObj = date.toDate ? date.toDate() : new Date(date)
          return dateObj.toLocaleDateString()
        } catch {
          return "N/A"
        }
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setStatusDialogOpen(true)
                }}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Change Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setEditDialogOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  // TODO: Implement delete functionality
                  if (confirm(`Are you sure you want to delete ${user.name || "this user"}?`)) {
                    alert("Delete functionality coming soon")
                  }
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: (row, columnId, filterValue) => {
      const search = filterValue.toLowerCase()
      const name = row.original.name?.toLowerCase() || ""
      const email = row.original.email?.toLowerCase() || ""
      const phone = (row.original.mobile || row.original.phone || "").toLowerCase()
      const cnic = (row.original.cnic || "").toLowerCase()
      const status = (row.original.status || "").toLowerCase()
      return name.includes(search) || email.includes(search) || phone.includes(search) || cnic.includes(search) || status.includes(search)
    },
    state: {
      globalFilter,
      rowSelection,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  const handleStatusUpdated = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <div className="space-y-4">
      <ChangeStatusDialog
        user={selectedUser}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        onStatusUpdated={handleStatusUpdated}
      />
      <EditUserDialog
        user={selectedUser}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUserUpdated={handleStatusUpdated}
      />
      <AddSubadminDialog
        open={addSubadminDialogOpen}
        onOpenChange={setAddSubadminDialogOpen}
        onSubadminCreated={handleStatusUpdated}
      />
      <AddUserDialog
        open={addUserDialogOpen}
        onOpenChange={setAddUserDialogOpen}
        onUserCreated={handleStatusUpdated}
      />
      <div className="flex items-center justify-between gap-4">
        <Input
          placeholder="Search by name, email, phone, NIC, or status..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAdmin && (
                <DropdownMenuItem onClick={() => setAddSubadminDialogOpen(true)}>
                  Add Subadmin
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setAddUserDialogOpen(true)}>
                Add User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="text-sm text-gray-600">
            {table.getFilteredRowModel().rows.length} of {data.length} applicants
          </div>
          {Object.keys(rowSelection).length > 0 && (
            <div className="text-sm text-amber-800 font-medium">
              {Object.keys(rowSelection).length} selected
            </div>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No applicants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
      </div>
    </div>
  )
}

