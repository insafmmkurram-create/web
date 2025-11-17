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
import { createSubadmin } from "@/lib/firebase-admin"
import { Loader2 } from "lucide-react"

interface AddSubadminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubadminCreated: () => void
}

export function AddSubadminDialog({
  open,
  onOpenChange,
  onSubadminCreated,
}: AddSubadminDialogProps) {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createSubadmin(email, password)
      setEmail("")
      setPassword("")
      onSubadminCreated()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to create subadmin. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subadmin</DialogTitle>
          <DialogDescription>
            Create a new subadmin account. Subadmin will have access to the dashboard but cannot add other subadmins.
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
              <Label htmlFor="subadmin-password">Password</Label>
              <Input
                id="subadmin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                minLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
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
                  Creating...
                </>
              ) : (
                "Create Subadmin"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

