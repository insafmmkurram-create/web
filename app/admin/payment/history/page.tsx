"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/admin/auth-guard"
import { getAllPaymentRecords, PaymentRecord } from "@/lib/firebase-admin"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export default function PaymentHistoryPage() {
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const router = useRouter()

  useEffect(() => {
    fetchPaymentHistory()
  }, [])

  useEffect(() => {
    setCurrentPage(0) // Reset to first page when search query changes
  }, [searchQuery])

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true)
      const fetchedPayments = await getAllPaymentRecords()
      setPaymentHistory(fetchedPayments)
    } catch (error) {
      console.error("Error fetching payment history:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-PK", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  // Group all payments by date
  const groupedPayments = paymentHistory.reduce((acc, payment) => {
    const dateKey = payment.date
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(payment)
    return acc
  }, {} as Record<string, PaymentRecord[]>)

  const sortedDates = Object.keys(groupedPayments).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  // Get payments for selected date
  const selectedDatePayments = selectedDate ? groupedPayments[selectedDate] || [] : []

  // Filter payments based on search query (only if date is selected)
  const filteredPayments = selectedDatePayments.filter((payment) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      payment.applicantName?.toLowerCase().includes(query) ||
      payment.nic?.toLowerCase().includes(query) ||
      payment.accountNumber?.toLowerCase().includes(query) ||
      payment.bankName?.toLowerCase().includes(query) ||
      payment.paymentStatus?.toLowerCase().includes(query)
    )
  })

  const getStatusColor = (status: string | undefined): string => {
    switch (status?.toLowerCase()) {
      case "received":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AuthGuard allowedRoles={["admin", "subadmin"]}>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.push("/admin/payment")} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Payment
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment History</h1>
            <p className="text-gray-600">View all payment records</p>
          </div>

          {selectedDate && (
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => {
              setSelectedDate(null)
              setCurrentPage(0)
            }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dates
            </Button>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, NIC, account number, bank name, or status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {filteredPayments.length} of {selectedDatePayments.length} records
                </div>
              </div>
            </Card>
          )}

          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">Loading payment history...</p>
            </Card>
          ) : !selectedDate ? (
            // Show list of dates
            sortedDates.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">No payment records found</p>
              </Card>
            ) : (
              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Select a Date</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedDates.map((date) => {
                    const datePayments = groupedPayments[date]
                    const totalForDate = datePayments.reduce((sum, p) => sum + p.paymentTotal, 0)

                    return (
                      <Card
                        key={date}
                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border-2 hover:border-blue-300"
                        onClick={() => {
                          setSelectedDate(date)
                          setCurrentPage(0)
                        }}
                      >
                        <div className="flex flex-col">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {formatDate(date)}
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>
                              <span className="font-medium">Total:</span>{" "}
                              <span className="font-bold text-green-600">{formatCurrency(totalForDate)}</span>
                            </div>
                            <div>
                              <span className="font-medium">Records:</span> {datePayments.length}
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </Card>
            )
          ) : (
            // Show selected date's payments
            filteredPayments.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">
                  {searchQuery ? "No payment records found matching your search" : "No payment records found for this date"}
                </p>
              </Card>
            ) : (
              <Card className="p-4">
                <div className="mb-4 flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {formatDate(selectedDate)}
                  </h3>
                  <div className="text-sm text-gray-600">
                    Total: <span className="font-bold">{formatCurrency(
                      selectedDatePayments.reduce((sum, p) => sum + p.paymentTotal, 0)
                    )}</span>
                    {" "}({selectedDatePayments.length} record{selectedDatePayments.length !== 1 ? "s" : ""})
                  </div>
                </div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Applicant Name</TableHead>
                        <TableHead>NIC</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead>Bank Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Payment Total (PKR)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(() => {
                        const startIndex = currentPage * pageSize
                        const endIndex = startIndex + pageSize
                        const paginatedPayments = filteredPayments.slice(startIndex, endIndex)
                        return paginatedPayments.map((payment, index) => (
                          <TableRow key={payment.id || startIndex + index}>
                            <TableCell className="font-medium">{payment.applicantName}</TableCell>
                            <TableCell>{payment.nic}</TableCell>
                            <TableCell>{payment.accountNumber}</TableCell>
                            <TableCell>{payment.bankName}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  payment.paymentStatus
                                )}`}
                              >
                                {(payment.paymentStatus || "received").toUpperCase()}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(payment.paymentTotal)}
                            </TableCell>
                          </TableRow>
                        ))
                      })()}
                    </TableBody>
                  </Table>
                </div>
                {filteredPayments.length > pageSize && (
                  <div className="flex items-center justify-between flex-wrap gap-4 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(0)}
                        disabled={currentPage === 0}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredPayments.length / pageSize) - 1, prev + 1))}
                        disabled={currentPage >= Math.ceil(filteredPayments.length / pageSize) - 1}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.ceil(filteredPayments.length / pageSize) - 1)}
                        disabled={currentPage >= Math.ceil(filteredPayments.length / pageSize) - 1}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rows per page:</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                              {pageSize}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setPageSize(10)
                                setCurrentPage(0)
                              }}
                            >
                              10
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setPageSize(25)
                                setCurrentPage(0)
                              }}
                            >
                              25
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setPageSize(50)
                                setCurrentPage(0)
                              }}
                            >
                              50
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setPageSize(100)
                                setCurrentPage(0)
                              }}
                            >
                              100
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-sm text-gray-600">
                        Page {currentPage + 1} of {Math.ceil(filteredPayments.length / pageSize)} 
                        {" "}({filteredPayments.length} total)
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )
          )}
        </div>
        <Footer />
      </main>
    </AuthGuard>
  )
}

