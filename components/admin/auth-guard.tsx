"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: ("admin" | "subadmin")[]
}

export function AuthGuard({ children, allowedRoles = ["admin", "subadmin"] }: AuthGuardProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Export userRole for use in children components
  useEffect(() => {
    if (userRole) {
      // Store in a way that children can access
      ;(window as any).__currentUserRole = userRole
    }
  }, [userRole])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        // Check user role in Firestore
        try {
          // You can change "users" to match your Flutter app's collection name
          const usersCollection = process.env.NEXT_PUBLIC_FIREBASE_USERS_COLLECTION || "users"
          const userDoc = await getDoc(doc(db, usersCollection, firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            const role = userData.role || "user"
            setUserRole(role)
            
            if (!allowedRoles.includes(role as "admin" | "subadmin")) {
              router.push("/")
              return
            }
          } else {
            // User document doesn't exist, redirect
            router.push("/")
            return
          }
        } catch (error) {
          console.error("Error checking user role:", error)
          router.push("/")
          return
        }
      } else {
        setUser(null)
        router.push("/")
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [allowedRoles, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-amber-800 mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!user || !userRole || !allowedRoles.includes(userRole as "admin" | "subadmin")) {
    return null
  }

  return <>{children}</>
}

