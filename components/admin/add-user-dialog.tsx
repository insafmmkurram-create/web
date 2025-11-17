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
import { createUser } from "@/lib/firebase-admin"
import { Loader2, Plus, Trash2 } from "lucide-react"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated: () => void
}

interface FamilyMember {
  name: string
  relation: string
  nic: string
  share: number
  gender: string
  dob: string
  married: boolean
  tribe: string
  subtribe: string
  province: string
  district: string
  tehsil: string
}

export function AddUserDialog({
  open,
  onOpenChange,
  onUserCreated,
}: AddUserDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    mobile: "",
    cnic: "",
    dob: "",
    gender: "",
    married: false,
    fatherName: "",
    tribe: "",
    subtribe: "",
    province: "",
    district: "",
    tehsil: "",
    bankName: "",
    accountNo: "",
  })
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
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

  const addFamilyMember = () => {
    setFamilyMembers((prev) => [
      ...prev,
      {
        name: "",
        relation: "",
        nic: "",
        share: 0,
        gender: "",
        dob: "",
        married: false,
        tribe: "",
        subtribe: "",
        province: "",
        district: "",
        tehsil: "",
      },
    ])
  }

  const removeFamilyMember = (index: number) => {
    setFamilyMembers((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await createUser({
        ...formData,
        familyMembers: familyMembers.filter((m) => m.name.trim() !== ""),
      })
      
      // Reset form
      setFormData({
        email: "",
        password: "",
        name: "",
        mobile: "",
        cnic: "",
        dob: "",
        gender: "",
        married: false,
        fatherName: "",
        tribe: "",
        subtribe: "",
        province: "",
        district: "",
        tehsil: "",
        bankName: "",
        accountNo: "",
      })
      setFamilyMembers([])
      onUserCreated()
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || "Failed to create user. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with complete registration information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Login Credentials */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Login Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="user-password">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mobile">Phone</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cnic">NIC</Label>
                  <Input
                    id="cnic"
                    value={formData.cnic}
                    onChange={(e) => handleInputChange("cnic", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors"
                    required
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
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors"
                    required
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
                    required
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tehsil">Tehsil</Label>
                  <Input
                    id="tehsil"
                    value={formData.tehsil}
                    onChange={(e) => handleInputChange("tehsil", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tribe">Tribe</Label>
                  <Input
                    id="tribe"
                    value={formData.tribe}
                    onChange={(e) => handleInputChange("tribe", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtribe">Subtribe</Label>
                  <Input
                    id="subtribe"
                    value={formData.subtribe}
                    onChange={(e) => handleInputChange("subtribe", e.target.value)}
                    required
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountNo">Account Number</Label>
                  <Input
                    id="accountNo"
                    value={formData.accountNo}
                    onChange={(e) => handleInputChange("accountNo", e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Family Members */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Family Members</h3>
                <Button type="button" variant="outline" size="sm" onClick={addFamilyMember}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
              <div className="space-y-4 max-h-60 overflow-y-auto border rounded-lg p-4">
                {familyMembers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No family members added</p>
                ) : (
                  familyMembers.map((member, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Family Member {index + 1}</h4>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFamilyMember(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => handleFamilyMemberChange(index, "name", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Relation</Label>
                          <Input
                            value={member.relation}
                            onChange={(e) => handleFamilyMemberChange(index, "relation", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>NIC</Label>
                          <Input
                            value={member.nic}
                            onChange={(e) => handleFamilyMemberChange(index, "nic", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Share (%)</Label>
                          <Input
                            type="number"
                            value={member.share}
                            onChange={(e) => handleFamilyMemberChange(index, "share", parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Gender</Label>
                          <select
                            value={member.gender}
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
                            value={member.dob}
                            onChange={(e) => handleFamilyMemberChange(index, "dob", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Marital Status</Label>
                          <select
                            value={member.married ? "true" : "false"}
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
                            value={member.tribe}
                            onChange={(e) => handleFamilyMemberChange(index, "tribe", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Subtribe</Label>
                          <Input
                            value={member.subtribe}
                            onChange={(e) => handleFamilyMemberChange(index, "subtribe", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Province</Label>
                          <Input
                            value={member.province}
                            onChange={(e) => handleFamilyMemberChange(index, "province", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>District</Label>
                          <Input
                            value={member.district}
                            onChange={(e) => handleFamilyMemberChange(index, "district", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Tehsil</Label>
                          <Input
                            value={member.tehsil}
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
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

