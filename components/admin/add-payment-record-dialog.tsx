"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { savePaymentRecords, PaymentRecord } from "@/lib/firebase-admin"
import { Loader2 } from "lucide-react"

interface AddPaymentRecordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  calculations: Array<{
    applicantName: string
    nic: string
    accountNumber: string
    bankName: string
    totalFamilyShare: number
  }>
  onRecordAdded: () => void
}

export function AddPaymentRecordDialog({
  open,
  onOpenChange,
  calculations,
  onRecordAdded,
}: AddPaymentRecordDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState<string>("")

  const handleSubmit = async () => {
    if (!date) {
      setError("Please select a date")
      return
    }

    if (calculations.length === 0) {
      setError("No payment data to save")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const paymentRecords: PaymentRecord[] = calculations.map((calc) => ({
        applicantName: calc.applicantName,
        nic: calc.nic,
        accountNumber: calc.accountNumber,
        bankName: calc.bankName,
        paymentTotal: calc.totalFamilyShare,
        date: date,
        paymentStatus: "received",
      }))

      await savePaymentRecords(paymentRecords)
      onRecordAdded()
      onOpenChange(false)
      setDate("")
    } catch (err: any) {
      console.error("Error saving payment records:", err)
      setError(err.message || "Failed to save payment records. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Record</DialogTitle>
          <DialogDescription>
            Select a date to save the current payment distribution to records
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="date">Payment Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="text-sm text-gray-600">
            This will save {calculations.length} payment record{calculations.length !== 1 ? "s" : ""} to the database.
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              setDate("")
              setError(null)
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Add"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

