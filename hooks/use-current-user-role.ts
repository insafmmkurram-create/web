"use client"

import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function useCurrentUserRole() {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const usersCollection = process.env.NEXT_PUBLIC_FIREBASE_USERS_COLLECTION || "users"
          const userDoc = await getDoc(doc(db, usersCollection, firebaseUser.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            const role = userData.role || "user"
            setUserRole(role)
          } else {
            setUserRole(null)
          }
        } catch (error) {
          console.error("Error checking user role:", error)
          setUserRole(null)
        }
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { userRole, loading }
}

