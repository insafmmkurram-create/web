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
import { User } from "@/lib/firebase-admin"
import { updateUserData, updateRegistrationData } from "@/lib/firebase-admin"
import { Loader2, Trash2, Save } from "lucide-react"
import Image from "next/image"

interface EditUserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserUpdated: () => void
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}: EditUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [familyMembers, setFamilyMembers] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || user.phone || "",
        cnic: user.cnic || "",
        dob: user.dob ? (typeof user.dob === "string" ? user.dob.split("T")[0] : "") : "",
        gender: user.gender || "",
        married: user.married !== undefined ? user.married : false,
        fatherName: user.fatherName || "",
        tribe: user.tribe || "",
        subtribe: user.subtribe || "",
        province: user.province || "",
        district: user.district || "",
        tehsil: user.tehsil || "",
        bankName: user.bankName || "",
        accountNo: user.accountNo || "",
      })
      setFamilyMembers(user.familyMembers ? [...user.familyMembers] : [])
    }
  }, [user])

  if (!user || !formData) return null

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleFamilyMemberChange = (index: number, field: string, value: any) => {
    setFamilyMembers((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [field]: value,
      }
      return updated
    })
  }

  const handleDeleteFamilyMember = (index: number) => {
    if (confirm("Are you sure you want to delete this family member?")) {
      setFamilyMembers((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const handleSave = async () => {
    if (!user.id) return

    try {
      setLoading(true)

      // Prepare updated data
      const updatedData = {
        ...formData,
        familyMembers: familyMembers,
      }

      // Update both collections
      await Promise.all([
        updateUserData(user.id, {
          name: formData.name,
          email: formData.email,
          cnic: formData.cnic,
        }),
        updateRegistrationData(user.id, updatedData),
      ])

      // Refresh the data
      onUserUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Failed to update user. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Details</DialogTitle>
          <DialogDescription>
            Update user registration information and manage family members
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

          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="mobile">Phone</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="cnic">NIC</Label>
                <Input
                  id="cnic"
                  value={formData.cnic}
                  onChange={(e) => handleInputChange("cnic", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <Label htmlFor="married">Marital Status</Label>
                <select
                  id="married"
                  value={formData.married ? "true" : "false"}
                  onChange={(e) => handleInputChange("married", e.target.value === "true")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="false">Unmarried</option>
                  <option value="true">Married</option>
                </select>
              </div>

              <div>
                <Label htmlFor="fatherName">Father Name</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange("fatherName", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Location Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => handleInputChange("province", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tehsil">Tehsil</Label>
                <Input
                  id="tehsil"
                  value={formData.tehsil}
                  onChange={(e) => handleInputChange("tehsil", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tribe">Tribe</Label>
                <Input
                  id="tribe"
                  value={formData.tribe}
                  onChange={(e) => handleInputChange("tribe", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="subtribe">Subtribe</Label>
                <Input
                  id="subtribe"
                  value={formData.subtribe}
                  onChange={(e) => handleInputChange("subtribe", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Bank Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="accountNo">Account Number</Label>
                <Input
                  id="accountNo"
                  value={formData.accountNo}
                  onChange={(e) => handleInputChange("accountNo", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Family Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Family Members ({familyMembers.length})</h3>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
              {familyMembers.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No family members</p>
              ) : (
                familyMembers.map((member: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Family Member {index + 1}</h4>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteFamilyMember(index)}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={member.name || ""}
                          onChange={(e) => handleFamilyMemberChange(index, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Relation</Label>
                        <Input
                          value={member.relation || ""}
                          onChange={(e) => handleFamilyMemberChange(index, "relation", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>NIC</Label>
                        <Input
                          value={member.nic || ""}
                          onChange={(e) => handleFamilyMemberChange(index, "nic", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Share (%)</Label>
                        <Input
                          type="number"
                          value={member.share || ""}
                          onChange={(e) => handleFamilyMemberChange(index, "share", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <select
                          value={member.gender || ""}
                          onChange={(e) => handleFamilyMemberChange(index, "gender", e.target.value)}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      <div>
                        <Label>Date of Birth</Label>
                        <Input
                          type="date"
                          value={member.dob ? (typeof member.dob === "string" ? member.dob.split("T")[0] : "") : ""}
                          onChange={(e) => handleFamilyMemberChange(index, "dob", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Marital Status</Label>
                        <select
                          value={member.married !== undefined ? (member.married ? "true" : "false") : ""}
                          onChange={(e) => handleFamilyMemberChange(index, "married", e.target.value === "true")}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors"
                        >
                          <option value="false">Unmarried</option>
                          <option value="true">Married</option>
                        </select>
                      </div>
                      <div>
                        <Label>Tribe</Label>
                        <Input
                          value={member.tribe || ""}
                          onChange={(e) => handleFamilyMemberChange(index, "tribe", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Subtribe</Label>
                        <Input
                          value={member.subtribe || ""}
                          onChange={(e) => handleFamilyMemberChange(index, "subtribe", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Province</Label>
                        <Input
                          value={member.province || ""}
                          onChange={(e) => handleFamilyMemberChange(index, "province", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>District</Label>
                        <Input
                          value={member.district || ""}
                          onChange={(e) => handleFamilyMemberChange(index, "district", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Tehsil</Label>
                        <Input
                          value={member.tehsil || ""}
                          onChange={(e) => handleFamilyMemberChange(index, "tehsil", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

