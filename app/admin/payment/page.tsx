"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthGuard } from "@/components/admin/auth-guard"
import { getAllUsers, User } from "@/lib/firebase-admin"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { ArrowLeft, DollarSign } from "lucide-react"

interface PaymentCalculation {
  applicantName: string
  nic: string
  accountNumber: string
  bankName: string
  totalFamilyShare: number
  category: "male" | "female" | "below18"
}

export default function PaymentPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState<string>("")
  const [calculations, setCalculations] = useState<PaymentCalculation[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const fetchedUsers = await getAllUsers()
      // Only show accepted users
      const acceptedUsers = fetchedUsers.filter(user => user.status === "accepted")
      setUsers(acceptedUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateAge = (dob: string | undefined): number | null => {
    if (!dob) return null
    try {
      const dateObj = typeof dob === "string" ? new Date(dob.split("T")[0]) : new Date(dob)
      if (isNaN(dateObj.getTime())) return null
      const today = new Date()
      let age = today.getFullYear() - dateObj.getFullYear()
      const monthDiff = today.getMonth() - dateObj.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateObj.getDate())) {
        age--
      }
      return age
    } catch {
      return null
    }
  }

  const determineCategoryForPerson = (
    dob: string | undefined,
    gender: string | undefined
  ): "male" | "female" | "below18" => {
    const age = calculateAge(dob)
    
    // Check if below 18
    if (age !== null && age < 18) {
      return "below18"
    }
    
    // Check gender
    const genderLower = gender?.toLowerCase()
    if (genderLower === "male" || genderLower === "m") {
      return "male"
    } else if (genderLower === "female" || genderLower === "f") {
      return "female"
    }
    
    // Default to male if gender/age not clear
    return "male"
  }

  const calculatePayments = () => {
    const totalAmount = parseFloat(amount)
    if (isNaN(totalAmount) || totalAmount <= 0) {
      alert("Please enter a valid amount")
      return
    }

    // Calculate category amounts (all percentages of total)
    const businessAmount = totalAmount * 0.5 // 50% of total
    const maleAmount = totalAmount * 0.30 // 30% of total
    const femaleAmount = totalAmount * 0.15 // 15% of total
    const below18Amount = totalAmount * 0.05 // 5% of total

    // First pass: Collect all people (applicants + family members) with their categories and shares
    interface PersonData {
      category: "male" | "female" | "below18"
      share: number
    }

    const allPeopleByCategory: Record<string, PersonData[]> = {
      male: [],
      female: [],
      below18: [],
    }

    // Process each applicant and their family
    users.forEach((user) => {
      // Process applicant
      const applicantCategory = determineCategoryForPerson(user.dob, user.gender)
      const applicantShare = user.familyMembers && user.familyMembers.length > 0
        ? (() => {
            // Calculate applicant's share (remaining after family members)
            const familySharesSum = user.familyMembers.reduce((sum: number, member: any) => {
              return sum + (member.share && typeof member.share === "number" ? member.share : 0)
            }, 0)
            return Math.max(0, 100 - familySharesSum) // Applicant gets remaining share
          })()
        : 100 // No family members, applicant has 100%

      allPeopleByCategory[applicantCategory].push({
        category: applicantCategory,
        share: applicantShare,
      })

      // Process family members
      if (user.familyMembers && user.familyMembers.length > 0) {
        user.familyMembers.forEach((member: any) => {
          const memberCategory = determineCategoryForPerson(member.dob, member.gender)
          const memberShare = member.share && typeof member.share === "number" ? member.share : 0
          
          if (memberShare > 0) {
            allPeopleByCategory[memberCategory].push({
              category: memberCategory,
              share: memberShare,
            })
          }
        })
      }
    })

    // Calculate total shares per category
    const categoryTotalShares: Record<string, number> = {
      male: allPeopleByCategory.male.reduce((sum, p) => sum + p.share, 0),
      female: allPeopleByCategory.female.reduce((sum, p) => sum + p.share, 0),
      below18: allPeopleByCategory.below18.reduce((sum, p) => sum + p.share, 0),
    }

    // Second pass: Calculate payment for each applicant's family
    const paymentCalcs: PaymentCalculation[] = users.map((user) => {
      let totalFamilyAmount = 0

      // Calculate applicant's amount
      const applicantCategory = determineCategoryForPerson(user.dob, user.gender)
      const applicantShare = user.familyMembers && user.familyMembers.length > 0
        ? (() => {
            const familySharesSum = user.familyMembers.reduce((sum: number, member: any) => {
              return sum + (member.share && typeof member.share === "number" ? member.share : 0)
            }, 0)
            return Math.max(0, 100 - familySharesSum)
          })()
        : 100

      let categoryAmount = 0
      if (applicantCategory === "male") {
        categoryAmount = maleAmount
      } else if (applicantCategory === "female") {
        categoryAmount = femaleAmount
      } else if (applicantCategory === "below18") {
        categoryAmount = below18Amount
      }

      const categoryTotal = categoryTotalShares[applicantCategory]
      if (categoryTotal > 0 && applicantShare > 0) {
        totalFamilyAmount += (categoryAmount * applicantShare) / categoryTotal
      }

      // Calculate each family member's amount
      if (user.familyMembers && user.familyMembers.length > 0) {
        user.familyMembers.forEach((member: any) => {
          const memberCategory = determineCategoryForPerson(member.dob, member.gender)
          const memberShare = member.share && typeof member.share === "number" ? member.share : 0

          if (memberShare > 0) {
            let memberCategoryAmount = 0
            if (memberCategory === "male") {
              memberCategoryAmount = maleAmount
            } else if (memberCategory === "female") {
              memberCategoryAmount = femaleAmount
            } else if (memberCategory === "below18") {
              memberCategoryAmount = below18Amount
            }

            const memberCategoryTotal = categoryTotalShares[memberCategory]
            if (memberCategoryTotal > 0) {
              totalFamilyAmount += (memberCategoryAmount * memberShare) / memberCategoryTotal
            }
          }
        })
      }

      // Determine the primary category for display (applicant's category)
      const primaryCategory = applicantCategory

      return {
        applicantName: user.name || "N/A",
        nic: user.cnic || "N/A",
        accountNumber: user.accountNo || "N/A",
        bankName: user.bankName || "N/A",
        totalFamilyShare: Math.round(totalFamilyAmount * 100) / 100, // Round to 2 decimal places
        category: primaryCategory,
      }
    })

    // Sort by category and then by name
    paymentCalcs.sort((a, b) => {
      const categoryOrder = { male: 0, female: 1, below18: 2 }
      const catDiff = (categoryOrder[a.category] || 0) - (categoryOrder[b.category] || 0)
      if (catDiff !== 0) return catDiff
      return a.applicantName.localeCompare(b.applicantName)
    })

    setCalculations(paymentCalcs)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case "male":
        return "Male"
      case "female":
        return "Female"
      case "below18":
        return "Below 18"
      default:
        return category
    }
  }

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case "male":
        return "bg-green-100 text-green-800"
      case "female":
        return "bg-pink-100 text-pink-800"
      case "below18":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalCalculated = calculations.reduce((sum, calc) => sum + calc.totalFamilyShare, 0)
  const totalAmountNum = parseFloat(amount) || 0

  return (
    <AuthGuard allowedRoles={["admin", "subadmin"]}>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.push("/admin")} className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Payment Distribution</h1>
            <p className="text-gray-600">Calculate and distribute payments to applicants</p>
          </div>

          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount (PKR)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter total amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <div className="pt-6">
                  <Button onClick={calculatePayments} size="lg">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Calculate Payments
                  </Button>
                </div>
              </div>

              {amount && !isNaN(parseFloat(amount)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-6 pt-6 border-t">
                  <div>
                    <div className="text-sm text-gray-500">Total Amount</div>
                    <div className="text-xl font-bold">{formatCurrency(totalAmountNum)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Business (50%)</div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(totalAmountNum * 0.5)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Public - Male (30%)</div>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(totalAmountNum * 0.30)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Public - Female (15%)</div>
                    <div className="text-xl font-bold text-pink-600">
                      {formatCurrency(totalAmountNum * 0.15)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Public - Below 18 (5%)</div>
                    <div className="text-xl font-bold text-yellow-600">
                      {formatCurrency(totalAmountNum * 0.05)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600">Loading applicants...</p>
            </Card>
          ) : calculations.length > 0 ? (
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Payment Distribution</h2>
                <div className="text-sm text-gray-600">
                  Total Distributed: <span className="font-bold">{formatCurrency(totalCalculated)}</span>
                </div>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Applicant Name</TableHead>
                      <TableHead>NIC</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Bank Name</TableHead>
                      <TableHead className="text-right">Total Family Share (PKR)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculations.map((calc, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                              calc.category
                            )}`}
                          >
                            {getCategoryLabel(calc.category)}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{calc.applicantName}</TableCell>
                        <TableCell>{calc.nic}</TableCell>
                        <TableCell>{calc.accountNumber}</TableCell>
                        <TableCell>{calc.bankName}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(calc.totalFamilyShare)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-600">
                Enter an amount and click "Calculate Payments" to see the distribution
              </p>
            </Card>
          )}
        </div>
        <Footer />
      </main>
    </AuthGuard>
  )
}

