import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { initializeApp, getApps, cert, App } from "firebase-admin/app"

// Initialize Firebase Admin SDK
let adminApp: App | null = null
let adminAuth: ReturnType<typeof getAuth> | null = null
let adminDb: ReturnType<typeof getFirestore> | null = null

function initializeAdminSDK() {
  if (adminApp && adminAuth && adminDb) {
    return { adminAuth, adminDb }
  }

  if (!getApps().length) {
    try {
      // Try to initialize with service account if available
      const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      
      if (serviceAccountKey) {
        try {
          const serviceAccount = JSON.parse(serviceAccountKey)
          adminApp = initializeApp({
            credential: cert(serviceAccount),
          })
        } catch (parseError) {
          console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", parseError)
          throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY format. Must be valid JSON.")
        }
      } else {
        // Fallback: Try to initialize with project ID (may work in some environments)
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
        if (projectId) {
          adminApp = initializeApp({
            projectId: projectId,
          })
        } else {
          throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY or NEXT_PUBLIC_FIREBASE_PROJECT_ID must be set")
        }
      }
    } catch (error: any) {
      console.error("Firebase Admin initialization error:", error)
      throw error
    }
  } else {
    adminApp = getApps()[0]
  }

  adminAuth = getAuth(adminApp)
  adminDb = getFirestore(adminApp)
  
  return { adminAuth, adminDb }
}

export async function DELETE(request: NextRequest) {
  try {
    // Initialize Admin SDK
    const { adminAuth: auth, adminDb: db } = initializeAdminSDK()
    
    if (!auth || !db) {
      return NextResponse.json(
        { 
          error: "Firebase Admin SDK not initialized. Please set up FIREBASE_SERVICE_ACCOUNT_KEY in environment variables. See FIREBASE_ADMIN_SETUP.md for instructions." 
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const usersCollection = process.env.NEXT_PUBLIC_FIREBASE_USERS_COLLECTION || "users"
    const registrationsCollection = process.env.NEXT_PUBLIC_FIREBASE_REGISTRATIONS_COLLECTION || "registrations"

    // Delete from Firebase Authentication
    try {
      await auth.deleteUser(userId)
      console.log(`Deleted user ${userId} from Firebase Authentication`)
    } catch (authError: any) {
      // If user doesn't exist in Auth, continue with Firestore deletion
      if (authError.code !== "auth/user-not-found") {
        console.error("Error deleting user from Auth:", authError)
        return NextResponse.json(
          { error: `Failed to delete user from Authentication: ${authError.message}` },
          { status: 400 }
        )
      } else {
        console.warn(`User ${userId} not found in Firebase Authentication, continuing with Firestore deletion`)
      }
    }

    // Delete from Firestore users collection
    try {
      const userRef = db.collection(usersCollection).doc(userId)
      await userRef.delete()
      console.log(`Deleted user ${userId} from Firestore users collection`)
    } catch (firestoreError: any) {
      console.error("Error deleting user from Firestore:", firestoreError)
      // Continue even if Firestore deletion fails, as Auth deletion succeeded
    }

    // Try to delete from registrations collection (if exists)
    try {
      // First, try to find registration by userId
      const registrationsRef = db.collection(registrationsCollection)
      const registrationsQuery = registrationsRef.where("userId", "==", userId)
      const registrationsSnapshot = await registrationsQuery.get()
      
      if (!registrationsSnapshot.empty) {
        const batch = db.batch()
        registrationsSnapshot.forEach((doc) => {
          batch.delete(doc.ref)
        })
        await batch.commit()
        console.log(`Deleted ${registrationsSnapshot.size} registration(s) for user ${userId}`)
      }

      // Also try to delete by document ID (in case userId is the doc ID)
      const registrationDocRef = db.collection(registrationsCollection).doc(userId)
      const registrationDoc = await registrationDocRef.get()
      if (registrationDoc.exists) {
        await registrationDocRef.delete()
        console.log(`Deleted registration document ${userId} from registrations collection`)
      }
    } catch (registrationError: any) {
      // Non-critical error, just log it
      console.warn("Error deleting from registrations collection:", registrationError)
    }

    return NextResponse.json(
      { 
        success: true,
        message: "User deleted successfully from Authentication and Firestore"
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    )
  }
}

