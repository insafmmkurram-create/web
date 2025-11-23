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

export async function POST(request: NextRequest) {
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
    const { userId, email, password } = body

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Update email in Firebase Authentication
    if (email) {
      try {
        await auth.updateUser(userId, {
          email: email,
          emailVerified: false, // Reset email verification when email changes
        })
      } catch (authError: any) {
        console.error("Error updating user in Auth:", authError)
        return NextResponse.json(
          { error: `Failed to update email in Authentication: ${authError.message}` },
          { status: 400 }
        )
      }
    }

    // Update password in Firebase Authentication
    if (password) {
      try {
        await auth.updateUser(userId, {
          password: password,
        })
      } catch (authError: any) {
        console.error("Error updating password in Auth:", authError)
        return NextResponse.json(
          { error: `Failed to update password: ${authError.message}` },
          { status: 400 }
        )
      }
    }

    // Update Firestore document
    const usersCollection = process.env.NEXT_PUBLIC_FIREBASE_USERS_COLLECTION || "users"
    const userRef = db.collection(usersCollection).doc(userId)
    
    const updateData: any = {
      updatedAt: new Date(),
    }
    
    if (email) {
      updateData.email = email
    }

    await userRef.update(updateData)

    return NextResponse.json(
      { 
        success: true,
        message: email && password 
          ? "Email and password updated successfully" 
          : email 
          ? "Email updated successfully" 
          : "Password updated successfully"
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    )
  }
}

