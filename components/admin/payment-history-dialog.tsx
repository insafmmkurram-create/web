"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllPaymentRecords, PaymentRecord } from "@/lib/firebase-admin"
import { Loader2 } from "lucide-react"

interface PaymentHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentHistoryDialog({
  open,
  onOpenChange,
}: PaymentHistoryDialogProps) {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchPayments()
    }
  }, [open])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedPayments = await getAllPaymentRecords()
      setPayments(fetchedPayments)
    } catch (err: any) {
      console.error("Error fetching payment records:", err)
      setError(err.message || "Failed to fetch payment records")
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

  // Group payments by date
  const groupedPayments = payments.reduce((acc, payment) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Payment History</DialogTitle>
          <DialogDescription>
            View all payment records by date
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading payment history...</span>
          </div>
        ) : error ? (
          <div className="text-sm text-red-600 bg-red-50 p-4 rounded-md">
            {error}
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            No payment records found
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {sortedDates.map((date) => {
              const datePayments = groupedPayments[date]
              const totalForDate = datePayments.reduce((sum, p) => sum + p.paymentTotal, 0)

              return (
                <div key={date} className="border rounded-lg p-4">
                  <div className="mb-4 flex items-center justify-between border-b pb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {formatDate(date)}
                    </h3>
                    <div className="text-sm text-gray-600">
                      Total: <span className="font-bold">{formatCurrency(totalForDate)}</span>
                      {" "}({datePayments.length} record{datePayments.length !== 1 ? "s" : ""})
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
                          <TableHead className="text-right">Payment Total (PKR)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {datePayments.map((payment, index) => (
                          <TableRow key={payment.id || index}>
                            <TableCell className="font-medium">{payment.applicantName}</TableCell>
                            <TableCell>{payment.nic}</TableCell>
                            <TableCell>{payment.accountNumber}</TableCell>
                            <TableCell>{payment.bankName}</TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(payment.paymentTotal)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

