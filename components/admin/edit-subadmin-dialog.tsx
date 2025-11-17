"use client"

import { useState, useEffect } from "react"
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
import { Subadmin } from "@/lib/types"
import { updateSubadmin, updateSubadminPassword } from "@/lib/firebase-admin"
import { Loader2 } from "lucide-react"

interface EditSubadminDialogProps {
  subadmin: Subadmin | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubadminUpdated: () => void
}

export function EditSubadminDialog({
  subadmin,
  open,
  onOpenChange,
  onSubadminUpdated,
}: EditSubadminDialogProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (subadmin) {
      setEmail(subadmin.email || "")
      setPassword("")
    }
  }, [subadmin])

  if (!subadmin) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Update email if changed
      if (email !== subadmin.email) {
        await updateSubadmin(subadmin.id, { email })
      }
      
      // Update password if provided
      // Note: Password can only be updated for the current user
      // For other users, this will show an error
      if (password.trim() !== "") {
        try {
          await updateSubadminPassword(subadmin.id, password)
        } catch (pwdErr: any) {
          // If password update fails, still allow email update
          if (email === subadmin.email) {
            throw pwdErr
          } else {
            setError(`Email updated, but password update failed: ${pwdErr.message}`)
            setPassword("")
            onSubadminUpdated()
            onOpenChange(false)
            setLoading(false)
            return
          }
        }
      }

      setPassword("")
      onSubadminUpdated()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to update subadmin. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subadmin</DialogTitle>
          <DialogDescription>
            Update subadmin email and password
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            <div>
              <Label htmlFor="subadmin-email">Email</Label>
              <Input
                id="subadmin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="subadmin@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="subadmin-password">New Password (leave blank to keep current)</Label>
              <Input
                id="subadmin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to keep current password. Note: Password updates require server-side implementation for other users.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Subadmin"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

