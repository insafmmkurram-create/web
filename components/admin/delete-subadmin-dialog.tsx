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
import { Subadmin } from "@/lib/types"
import { deleteSubadmin } from "@/lib/firebase-admin"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteSubadminDialogProps {
  subadmin: Subadmin | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubadminDeleted: () => void
}

export function DeleteSubadminDialog({
  subadmin,
  open,
  onOpenChange,
  onSubadminDeleted,
}: DeleteSubadminDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!subadmin) return null

  const handleDelete = async () => {
    setLoading(true)
    setError(null)

    try {
      await deleteSubadmin(subadmin.id)
      onSubadminDeleted()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to delete subadmin. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Delete Subadmin
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this subadmin? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm mb-4">
              {error}
            </div>
          )}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Email:</p>
            <p className="text-base text-gray-900">{subadmin.email}</p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Subadmin"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

