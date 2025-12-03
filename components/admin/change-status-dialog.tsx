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
import { User } from "@/lib/firebase-admin"
import { updateUserStatus, updateRegistrationStatus } from "@/lib/firebase-admin"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import { useCurrentUserRole } from "@/hooks/use-current-user-role"

interface ChangeStatusDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusUpdated: () => void
}

export function ChangeStatusDialog({
  user,
  open,
  onOpenChange,
  onStatusUpdated,
}: ChangeStatusDialogProps) {
  const [loading, setLoading] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  const { userRole } = useCurrentUserRole()
  const isAdmin = userRole === "admin"

  if (!user) return null

  const handleStatusChange = async (newStatus: "accepted" | "rejected") => {
    if (!user.id || !isAdmin) return // Prevent status change for subadmins

    try {
      setLoading(true)
      setUpdatingStatus(newStatus)

      // Update status in both collections
      await Promise.all([
        updateUserStatus(user.id, newStatus),
        updateRegistrationStatus(user.id, newStatus),
      ])

      // Refresh the data
      onStatusUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status. Please try again.")
    } finally {
      setLoading(false)
      setUpdatingStatus(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Change User Status</DialogTitle>
          <DialogDescription>
            Review user registration details and update their status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Image */}
          <div className="flex justify-center">
            {user.imageUrl ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
                <Image
                  src={user.imageUrl}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                <span className="text-gray-400 text-sm">No Image</span>
              </div>
            )}
          </div>

          {/* Registration Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-base font-semibold">{user.name || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-base">{user.email || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Phone</label>
              <p className="text-base">{user.mobile || user.phone || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">NIC</label>
              <p className="text-base">{user.cnic || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth</label>
              <p className="text-base">
                {user.dob ? (typeof user.dob === "string" ? user.dob.split("T")[0] : "N/A") : "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Gender</label>
              <p className="text-base">{user.gender || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Marital Status</label>
              <p className="text-base">
                {user.married !== undefined 
                  ? (user.married ? "Married" : "Unmarried")
                  : "N/A"}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Father Name</label>
              <p className="text-base">{user.fatherName || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tribe</label>
              <p className="text-base">{user.tribe || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Subtribe</label>
              <p className="text-base">{user.subtribe || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Province</label>
              <p className="text-base">{user.province || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">District</label>
              <p className="text-base">{user.district || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Tehsil</label>
              <p className="text-base">{user.tehsil || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Bank Name</label>
              <p className="text-base">{user.bankName || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Account Number</label>
              <p className="text-base">{user.accountNo || "N/A"}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Current Status</label>
              <p className="text-base">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : user.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {user.status?.toUpperCase() || "PENDING"}
                </span>
              </p>
            </div>
          </div>

          {/* Family Members */}
          {user.familyMembers && user.familyMembers.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">
                Family Members ({user.familyMembers.length})
              </label>
              <div className="border rounded-lg p-4 space-y-3 max-h-60 overflow-y-auto">
                {user.familyMembers.map((member: any, index: number) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Name:</span> {member.name || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Relation:</span> {member.relation || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">NIC:</span> {member.nic || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Share:</span> {member.share ? `${member.share}%` : "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Gender:</span> {member.gender || "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">Marital Status:</span>{" "}
                        {member.married !== undefined
                          ? member.married
                            ? "Married"
                            : "Unmarried"
                          : "N/A"}
                      </div>
                      <div>
                        <span className="font-medium">DOB:</span>{" "}
                        {member.dob ? (typeof member.dob === "string" ? member.dob.split("T")[0] : "N/A") : "N/A"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          {isAdmin ? (
            <>
              <Button
                variant="destructive"
                onClick={() => handleStatusChange("rejected")}
                disabled={loading}
                className="gap-2"
              >
                {updatingStatus === "rejected" && loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                Reject
              </Button>
              <Button
                onClick={() => handleStatusChange("accepted")}
                disabled={loading}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                {updatingStatus === "accepted" && loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Accept
              </Button>
            </>
          ) : (
            <div className="text-sm text-gray-500 italic">
              Only administrators can change user status
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

