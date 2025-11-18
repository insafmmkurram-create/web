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
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Edit, Trash2, FileCheck, Plus, Printer, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  
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
          const dateObj = (date as any)?.toDate ? (date as any).toDate() : new Date(date as string | number | Date)
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
                onClick={() => handlePrint(user)}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print
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

  const handlePrint = (user: User) => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    // Format date
    const formatDate = (date: any) => {
      if (!date) return "N/A"
      try {
        const dateObj = (date as any)?.toDate ? (date as any).toDate() : new Date(date as string | number | Date)
        return dateObj.toLocaleDateString()
      } catch {
        return "N/A"
      }
    }

    // Format marital status
    const formatMaritalStatus = (married: boolean | undefined) => {
      if (married === undefined) return "N/A"
      return married ? "Married" : "Unmarried"
    }

    // Build family members HTML
    const familyMembers = user.familyMembers || []
    const familyMembersHtml = familyMembers.length > 0
      ? `
        <div style="margin-top: 20px; page-break-inside: avoid;">
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 10px; color: #374151;">
            Family Members (${familyMembers.length})
          </h3>
          <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px;">
            ${familyMembers.map((member: any, index: number) => `
              <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 12px; margin-bottom: 12px; ${index === familyMembers.length - 1 ? 'border-bottom: none; margin-bottom: 0;' : ''}">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 13px;">
                  <div><strong>Name:</strong> ${member.name || "N/A"}</div>
                  <div><strong>Relation:</strong> ${member.relation || "N/A"}</div>
                  <div><strong>NIC:</strong> ${member.nic || "N/A"}</div>
                  <div><strong>Share:</strong> ${member.share ? `${member.share}%` : "N/A"}</div>
                  <div><strong>Gender:</strong> ${member.gender || "N/A"}</div>
                  <div><strong>Marital Status:</strong> ${formatMaritalStatus(member.married)}</div>
                  <div><strong>DOB:</strong> ${formatDate(member.dob)}</div>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `
      : ""

    // Status badge color
    const statusColor = user.status === "accepted" 
      ? "#10b981" 
      : user.status === "rejected" 
      ? "#ef4444" 
      : "#f59e0b"

    // Build the HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Insaf Mining & Minerals Private Limited - Registration Details - ${user.name || "N/A"}</title>
          <style>
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #111827;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              color: #111827;
            }
            .user-image {
              text-align: center;
              margin: 20px 0;
            }
            .user-image img {
              width: 128px;
              height: 128px;
              border-radius: 50%;
              border: 4px solid #e5e7eb;
              object-fit: cover;
            }
            .user-image-placeholder {
              width: 128px;
              height: 128px;
              border-radius: 50%;
              background-color: #e5e7eb;
              border: 4px solid #d1d5db;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              color: #9ca3af;
              font-size: 12px;
            }
            .details-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 20px;
            }
            .detail-item {
              margin-bottom: 15px;
            }
            .detail-label {
              font-size: 12px;
              font-weight: 500;
              color: #6b7280;
              margin-bottom: 4px;
            }
            .detail-value {
              font-size: 14px;
              font-weight: 600;
              color: #111827;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 500;
              text-transform: uppercase;
            }
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              padding: 10px 20px;
              background-color: #3b82f6;
              color: white;
              border: none;
              border-radius: 6px;
              cursor: pointer;
              font-size: 14px;
            }
            .print-button:hover {
              background-color: #2563eb;
            }
          </style>
        </head>
        <body>
          <button class="print-button no-print" onclick="window.print()">Print</button>
          
          <div class="header">
            <h1>Insaf Mining & Minerals Private Limited - Registration Details</h1>
          </div>

          <div class="user-image">
            ${user.imageUrl 
              ? `<img src="${user.imageUrl}" alt="${user.name || "User"}" />` 
              : `<div class="user-image-placeholder">No Image</div>`
            }
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <div class="detail-label">Name</div>
              <div class="detail-value">${user.name || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Email</div>
              <div class="detail-value">${user.email || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Phone</div>
              <div class="detail-value">${user.mobile || user.phone || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">NIC</div>
              <div class="detail-value">${user.cnic || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Date of Birth</div>
              <div class="detail-value">${formatDate(user.dob)}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Gender</div>
              <div class="detail-value">${user.gender || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Marital Status</div>
              <div class="detail-value">${formatMaritalStatus(user.married)}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Father Name</div>
              <div class="detail-value">${user.fatherName || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Tribe</div>
              <div class="detail-value">${user.tribe || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Subtribe</div>
              <div class="detail-value">${user.subtribe || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Province</div>
              <div class="detail-value">${user.province || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">District</div>
              <div class="detail-value">${user.district || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Tehsil</div>
              <div class="detail-value">${user.tehsil || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Bank Name</div>
              <div class="detail-value">${user.bankName || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Account Number</div>
              <div class="detail-value">${user.accountNo || "N/A"}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Current Status</div>
              <div class="detail-value">
                <span class="status-badge" style="background-color: ${statusColor}20; color: ${statusColor};">
                  ${(user.status || "PENDING").toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          ${familyMembersHtml}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
            Generated on ${new Date().toLocaleString()}
          </div>
        </body>
      </html>
    `

    // Write content and trigger print
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Wait for images to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 250)
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
          <Button onClick={() => router.push("/admin/payment")}>
            <DollarSign className="mr-2 h-4 w-4" />
            Payment
          </Button>
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

