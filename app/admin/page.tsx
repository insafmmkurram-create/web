"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { StatsCards } from "@/components/admin/stats-cards"
import { UsersTable } from "@/components/admin/users-table"
import { SubadminsTable } from "@/components/admin/subadmins-table"
import { Subadmin } from "@/lib/types"
import { AuthGuard } from "@/components/admin/auth-guard"
import { getAllUsers, User, getAllSubadmins } from "@/lib/firebase-admin"
import { checkFirebaseConfig } from "@/lib/firebase-debug"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCurrentUserRole } from "@/hooks/use-current-user-role"
import { Loader2, LogOut, Users, Newspaper } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [subadmins, setSubadmins] = useState<Subadmin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSubadmins, setShowSubadmins] = useState(false)
  const router = useRouter()
  const { userRole } = useCurrentUserRole()
  const isAdmin = userRole === "admin"

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/admin/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const fetchUsers = async () => {
    // Check Firebase config first
    const configCheck = checkFirebaseConfig()
    if (!configCheck.valid) {
      setError(configCheck.message)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const fetchedUsers = await getAllUsers()
      setUsers(fetchedUsers)
      setError(null)
    } catch (err: any) {
      console.error("Error fetching users:", err)
      let errorMessage = "Failed to fetch users. "
      
      if (err?.code === "permission-denied") {
        errorMessage += "Permission denied. Please check Firestore security rules."
      } else if (err?.code === "unavailable") {
        errorMessage += "Firestore is unavailable. Please check your internet connection."
      } else if (err?.message?.includes("collection")) {
        errorMessage += `Collection not found. Check if the collection name matches your Flutter app.`
      } else if (err?.message) {
        errorMessage += `Error: ${err.message}`
      } else {
        errorMessage += "Please check your Firebase configuration and Firestore setup."
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubadmins = async () => {
    try {
      const fetchedSubadmins = await getAllSubadmins()
      setSubadmins(fetchedSubadmins)
    } catch (err: any) {
      console.error("Error fetching subadmins:", err)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (isAdmin) {
      fetchSubadmins()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin])

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

  const isMale = (gender: string | undefined): boolean => {
    const genderLower = gender?.toLowerCase()
    return genderLower === "male" || genderLower === "m"
  }

  const isFemale = (gender: string | undefined): boolean => {
    const genderLower = gender?.toLowerCase()
    return genderLower === "female" || genderLower === "f"
  }

  const isBelow18 = (dob: string | undefined): boolean => {
    const age = calculateAge(dob)
    return age !== null && age < 18
  }

  // Filter accepted users, excluding admin and subadmin
  const acceptedUsers = users.filter((u) => 
    u.status === "accepted" && 
    u.role !== "admin" && 
    u.role !== "subadmin"
  )
  
  // Calculate totals including family members
  let totalMales = 0
  let totalFemales = 0
  let totalKids = 0

  acceptedUsers.forEach((user) => {
    // Count the applicant
    if (isBelow18(user.dob)) {
      // If below 18, count as kid only
      totalKids++
    } else {
      // If 18 or above, count by gender
      if (isMale(user.gender)) {
        totalMales++
      } else if (isFemale(user.gender)) {
        totalFemales++
      }
    }

    // Count family members
    if (user.familyMembers && user.familyMembers.length > 0) {
      user.familyMembers.forEach((member: any) => {
        if (isBelow18(member.dob)) {
          // If below 18, count as kid only
          totalKids++
        } else {
          // If 18 or above, count by gender
          if (isMale(member.gender)) {
            totalMales++
          } else if (isFemale(member.gender)) {
            totalFemales++
          }
        }
      })
    }
  })
  
  const stats = {
    total: users.length,
    accepted: acceptedUsers.length,
    rejected: users.filter((u) => u.status === "rejected").length,
    pending: users.filter((u) => u.status === "pending").length,
    acceptedMales: totalMales,
    acceptedFemales: totalFemales,
    acceptedKids: totalKids,
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-800 mb-4" />
            <p className="text-gray-600">Loading applicants...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-6 border-red-200 bg-red-50">
            <h2 className="text-xl font-bold text-red-800 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            
            <div className="mt-4 space-y-3">
              <h3 className="font-semibold text-red-800">Troubleshooting Steps:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-red-700">
                <li>Check that <code className="bg-red-100 px-1 rounded">.env.local</code> file exists in the root directory</li>
                <li>Verify all Firebase environment variables are set:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>NEXT_PUBLIC_FIREBASE_API_KEY</li>
                    <li>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</li>
                    <li>NEXT_PUBLIC_FIREBASE_PROJECT_ID</li>
                    <li>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</li>
                    <li>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</li>
                    <li>NEXT_PUBLIC_FIREBASE_APP_ID</li>
                  </ul>
                </li>
                <li>Restart your development server after creating/updating .env.local</li>
                <li>Check browser console (F12) for detailed error messages</li>
                <li>Verify Firestore Database is enabled in Firebase Console</li>
                <li>Check Firestore security rules allow read access</li>
                <li>Verify the collection name matches your Flutter app (default: "users")</li>
              </ol>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded border border-red-200">
              <p className="text-sm font-semibold text-gray-800 mb-2">Check Browser Console:</p>
              <p className="text-xs text-gray-600">Press F12 → Console tab to see detailed error messages</p>
            </div>
          </Card>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <AuthGuard allowedRoles={["admin", "subadmin"]}>
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage and view all applicant registrations</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => router.push("/admin/news")}
                >
                  <Newspaper className="mr-2 h-4 w-4" />
                  News
                </Button>
                <Button 
                  variant={showSubadmins ? "default" : "outline"} 
                  onClick={() => {
                    setShowSubadmins(!showSubadmins)
                    if (!showSubadmins) {
                      fetchSubadmins()
                    }
                  }}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {showSubadmins ? "View Applicants" : "View Subadmins"}
                </Button>
              </>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

          {!showSubadmins ? (
            <>
              <StatsCards
                total={stats.total}
                accepted={stats.accepted}
                rejected={stats.rejected}
                pending={stats.pending}
                acceptedMales={stats.acceptedMales}
                acceptedFemales={stats.acceptedFemales}
                acceptedKids={stats.acceptedKids}
              />

              <Card className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Applicants</h2>
                <UsersTable data={users} onRefresh={fetchUsers} />
              </Card>
            </>
          ) : (
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">All Subadmins</h2>
              <SubadminsTable data={subadmins} onRefresh={fetchSubadmins} />
            </Card>
          )}
        </div>
        <Footer />
      </main>
    </AuthGuard>
  )
}

