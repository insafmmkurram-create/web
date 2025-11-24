"use client"

import { collection, getDocs, query, where, DocumentData, doc, setDoc, serverTimestamp, writeBatch, addDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "./firebase"

export interface User {
  id: string
  email?: string
  name?: string
  phone?: string
  mobile?: string // From registrations collection
  cnic?: string // CNIC from users collection
  address?: string
  status: "pending" | "accepted" | "rejected"
  role?: "admin" | "subadmin" | "user"
  createdAt?: any
  updatedAt?: any
  imageUrl?: string | null // User image from users collection
  district?: string
  province?: string
  tehsil?: string
  tribe?: string
  subtribe?: string
  dob?: string
  gender?: string
  married?: boolean
  fatherName?: string
  accountNo?: string
  bankName?: string
  familyMembers?: any[]
  [key: string]: any
}

// You can change this collection name to match your Flutter app's collection name
const USERS_COLLECTION = process.env.NEXT_PUBLIC_FIREBASE_USERS_COLLECTION || "users"
const REGISTRATIONS_COLLECTION = process.env.NEXT_PUBLIC_FIREBASE_REGISTRATIONS_COLLECTION || "registrations"

export async function getAllUsers(): Promise<User[]> {
  try {
    // Debug: Log collection names
    console.log("Fetching users from collection:", USERS_COLLECTION)
    console.log("Fetching registrations from collection:", REGISTRATIONS_COLLECTION)
    
    // Fetch users collection
    const usersCollection = collection(db, USERS_COLLECTION)
    const usersSnapshot = await getDocs(usersCollection)
    
    // Fetch registrations collection
    const registrationsCollection = collection(db, REGISTRATIONS_COLLECTION)
    const registrationsSnapshot = await getDocs(registrationsCollection)
    
    console.log("Users snapshot size:", usersSnapshot.size)
    console.log("Registrations snapshot size:", registrationsSnapshot.size)
    
    // Create a map of registrations by userId, email, and document ID for quick lookup
    const registrationsMapByUserId = new Map<string, any>()
    const registrationsMapByEmail = new Map<string, any>()
    const registrationsMapByDocId = new Map<string, any>()
    
    registrationsSnapshot.forEach((doc) => {
      const regData = doc.data()
      
      // Debug: Log the full registration data structure
      console.log(`Registration document ID: ${doc.id}`, regData)
      console.log(`Registration keys:`, Object.keys(regData))
      console.log(`Registration mobile value:`, regData.mobile)
      console.log(`Registration name value:`, regData.name)
      
      // Map by userId (primary matching method)
      if (regData.userId) {
        registrationsMapByUserId.set(regData.userId, regData)
        console.log(`Mapped registration by userId: ${regData.userId}`, { 
          mobile: regData.mobile, 
          name: regData.name,
          email: regData.email,
          fullData: regData
        })
      }
      
      // Map by email (fallback matching method)
      if (regData.email) {
        registrationsMapByEmail.set(regData.email.toLowerCase(), regData)
      }
      
      // Map by document ID (fallback)
      registrationsMapByDocId.set(doc.id, regData)
    })
    
    console.log(`Total registrations mapped - by userId: ${registrationsMapByUserId.size}, by email: ${registrationsMapByEmail.size}, by docId: ${registrationsMapByDocId.size}`)
    
    // Combine users with registrations data
    const users: User[] = []
    usersSnapshot.forEach((doc) => {
      const userData = doc.data()
      const userEmail = userData.email?.toLowerCase() || ""
      
      // Try multiple matching strategies
      let registration = registrationsMapByUserId.get(doc.id) || null
      
      if (!registration) {
        // Try matching by email
        registration = registrationsMapByEmail.get(userEmail) || null
        if (registration) {
          console.log(`Matched registration by email for user ${doc.id}`)
        }
      }
      
      if (!registration) {
        // Try matching by document ID
        registration = registrationsMapByDocId.get(doc.id) || null
        if (registration) {
          console.log(`Matched registration by docId for user ${doc.id}`)
        }
      }
      
      if (registration) {
        console.log(`Found registration for user ${doc.id}:`, { 
          mobile: registration.mobile, 
          name: registration.name,
          userId: registration.userId,
          email: registration.email,
          allKeys: Object.keys(registration),
          fullRegistration: registration
        })
      } else {
        console.warn(`No registration found for user ${doc.id} (email: ${userEmail}). Available userIds:`, Array.from(registrationsMapByUserId.keys()).slice(0, 5))
      }
      
      // Merge user data with registration data
      // The data is nested inside 'applicant' object
      const applicant = registration?.applicant || {}
      
      const registrationMobile = applicant?.mobile || 
                                  registration?.mobile || 
                                  userData.mobile || 
                                  null
      
      const registrationName = applicant?.name || 
                               registration?.name || 
                               userData.name || 
                               null
      
      const registrationNic = applicant?.nic || 
                             registration?.nic || 
                             userData.cnic || 
                             null
      
      console.log(`Extracted values for user ${doc.id}:`, {
        registrationMobile,
        registrationName,
        registrationNic,
        hasRegistration: !!registration,
        hasApplicant: !!applicant,
        applicantKeys: applicant ? Object.keys(applicant) : []
      })
      
      const mergedUser: User = {
        id: doc.id,
        ...userData,
        status: userData.status || "pending",
        // Get mobile from registrations.applicant.mobile
        phone: registrationMobile || userData.phone || "N/A",
        mobile: registrationMobile || userData.mobile || "N/A",
        // Get cnic from users collection, or nic from registrations.applicant.nic as fallback
        cnic: userData.cnic || registrationNic || "N/A",
        // Include additional registration fields from applicant object
        name: registrationName || userData.name || "N/A",
        district: applicant?.district || registration?.district,
        province: applicant?.province || registration?.province,
        tehsil: applicant?.tehsil || registration?.tehsil,
        tribe: applicant?.tribe || registration?.tribe,
        subtribe: applicant?.subtribe || registration?.subtribe,
        dob: applicant?.dob || registration?.dob,
        gender: applicant?.gender || registration?.gender,
        married: applicant?.married !== undefined ? applicant.married : registration?.married,
        fatherName: applicant?.fatherName || registration?.fatherName,
        accountNo: applicant?.accountNo || registration?.accountNo,
        bankName: applicant?.bankName || registration?.bankName,
        familyMembers: registration?.familyMembers || [],
        // Get image from users collection (imageUrl field)
        imageUrl: userData.imageUrl || registration?.imageUrl || null,
      }
      
      console.log(`Final merged user ${doc.id}:`, { phone: mergedUser.phone, mobile: mergedUser.mobile, cnic: mergedUser.cnic })
      
      // Filter out admin and subadmin users from the list
      if (mergedUser.role !== "admin" && mergedUser.role !== "subadmin") {
        users.push(mergedUser)
      } else {
        console.log(`Filtered out admin/subadmin user: ${doc.id} (role: ${mergedUser.role})`)
      }
    })
    
    console.log("Fetched and merged users (excluding admins):", users.length)
    return users
  } catch (error: any) {
    console.error("Error fetching users:", error)
    console.error("Error code:", error?.code)
    console.error("Error message:", error?.message)
    throw error
  }
}

export async function getUsersByStatus(status: "pending" | "accepted" | "rejected"): Promise<User[]> {
  try {
    // Fetch all users and filter by status (since we need to merge with registrations anyway)
    const allUsers = await getAllUsers()
    return allUsers.filter((user) => user.status === status)
  } catch (error) {
    console.error("Error fetching users by status:", error)
    throw error
  }
}

export async function updateUserStatus(
  userId: string,
  status: "pending" | "accepted" | "rejected"
): Promise<void> {
  try {
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")
    
    // Update status in users collection
    const userRef = doc(db, USERS_COLLECTION, userId)
    await updateDoc(userRef, {
      status: status,
      updatedAt: serverTimestamp(),
    })
    
    console.log(`Updated user ${userId} status to ${status} in users collection`)
  } catch (error) {
    console.error("Error updating user status:", error)
    throw error
  }
}

export async function updateUserData(userId: string, data: Partial<User>): Promise<void> {
  try {
    const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")
    
    // Update user document
    const userRef = doc(db, USERS_COLLECTION, userId)
    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp(),
    }
    
    await updateDoc(userRef, updateData)
    console.log(`Updated user ${userId} data in users collection`)
  } catch (error) {
    console.error("Error updating user data:", error)
    throw error
  }
}

export async function updateRegistrationData(userId: string, data: any): Promise<void> {
  try {
    const { collection, query, where, getDocs, updateDoc, serverTimestamp } = await import("firebase/firestore")
    
    // Find registration document by userId
    const registrationsCollection = collection(db, REGISTRATIONS_COLLECTION)
    const q = query(registrationsCollection, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      // Update all matching registration documents
      const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const regRef = docSnapshot.ref
        
        // Prepare update data - update applicant object
        const updateData: any = {
          updatedAt: serverTimestamp(),
        }
        
        // Update applicant object with form data
        updateData.applicant = {
          name: data.name,
          mobile: data.mobile,
          nic: data.cnic,
          dob: data.dob,
          gender: data.gender,
          married: data.married,
          fatherName: data.fatherName,
          tribe: data.tribe,
          subtribe: data.subtribe,
          province: data.province,
          district: data.district,
          tehsil: data.tehsil,
          accountNo: data.accountNo,
          bankName: data.bankName,
        }
        
        // Update family members
        updateData.familyMembers = data.familyMembers || []
        
        return updateDoc(regRef, updateData)
      })
      
      await Promise.all(updatePromises)
      console.log(`Updated registration data for userId ${userId}`)
    } else {
      console.warn(`No registration found for userId ${userId}`)
    }
  } catch (error) {
    console.error("Error updating registration data:", error)
    throw error
  }
}

export async function updateRegistrationStatus(
  userId: string,
  status: "pending" | "accepted" | "rejected"
): Promise<void> {
  try {
    const { collection, query, where, getDocs, updateDoc, serverTimestamp } = await import("firebase/firestore")
    
    // Find registration document by userId
    const registrationsCollection = collection(db, REGISTRATIONS_COLLECTION)
    const q = query(registrationsCollection, where("userId", "==", userId))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      // Update all matching registration documents
      const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
        const regRef = docSnapshot.ref
        const regData = docSnapshot.data()
        
        // Update status at root level and also in applicant object if it exists
        const updateData: any = {
          updatedAt: serverTimestamp(),
        }
        
        // Add status at root level
        updateData.status = status
        
        // If applicant object exists, we might want to update it there too
        // But based on the structure, status is typically at root level
        // If you need to update applicant.status, uncomment below:
        // if (regData.applicant) {
        //   updateData['applicant.status'] = status
        // }
        
        return updateDoc(regRef, updateData)
      })
      
      await Promise.all(updatePromises)
      console.log(`Updated registration status to ${status} for userId ${userId}`)
    } else {
      console.warn(`No registration found for userId ${userId}`)
    }
  } catch (error) {
    console.error("Error updating registration status:", error)
    throw error
  }
}

export async function createSubadmin(email: string, password: string): Promise<void> {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const userId = userCredential.user.uid

    // Create user document in Firestore with subadmin role
    const userRef = doc(db, USERS_COLLECTION, userId)
    await setDoc(userRef, {
      email: email,
      role: "subadmin",
      status: "accepted",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log(`Created subadmin with ID: ${userId}`)
  } catch (error: any) {
    console.error("Error creating subadmin:", error)
    throw new Error(error.message || "Failed to create subadmin")
  }
}

export async function createUser(userData: {
  email: string
  password: string
  name: string
  mobile: string
  cnic: string
  dob: string
  gender: string
  married: boolean
  fatherName: string
  tribe: string
  subtribe: string
  province: string
  district: string
  tehsil: string
  bankName: string
  accountNo: string
  familyMembers?: any[]
}): Promise<void> {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
    const userId = userCredential.user.uid

    // Create user document in Firestore
    const userRef = doc(db, USERS_COLLECTION, userId)
    await setDoc(userRef, {
      email: userData.email,
      name: userData.name,
      cnic: userData.cnic,
      role: "user",
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Create registration document
    const registrationRef = doc(db, REGISTRATIONS_COLLECTION, userId)
    await setDoc(registrationRef, {
      userId: userId,
      email: userData.email,
      applicant: {
        name: userData.name,
        mobile: userData.mobile,
        nic: userData.cnic,
        dob: userData.dob,
        gender: userData.gender,
        married: userData.married,
        fatherName: userData.fatherName,
        tribe: userData.tribe,
        subtribe: userData.subtribe,
        province: userData.province,
        district: userData.district,
        tehsil: userData.tehsil,
        accountNo: userData.accountNo,
        bankName: userData.bankName,
      },
      familyMembers: userData.familyMembers || [],
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    console.log(`Created user with ID: ${userId}`)
  } catch (error: any) {
    console.error("Error creating user:", error)
    throw new Error(error.message || "Failed to create user")
  }
}

export async function getAllSubadmins(): Promise<any[]> {
  try {
    const usersCollection = collection(db, USERS_COLLECTION)
    const q = query(usersCollection, where("role", "==", "subadmin"))
    const querySnapshot = await getDocs(q)

    const subadmins: any[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      subadmins.push({
        id: doc.id,
        email: data.email || "",
        role: "subadmin",
        status: data.status || "accepted",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      })
    })

    return subadmins
  } catch (error: any) {
    console.error("Error fetching subadmins:", error)
    throw error
  }
}

export interface PaymentRecord {
  id?: string
  userId?: string
  applicantName: string
  nic: string
  accountNumber: string
  bankName: string
  paymentTotal: number
  date: string // ISO date string
  paymentStatus?: string
  createdAt?: any
}

const PAYMENTS_COLLECTION = "payments"

export async function savePaymentRecord(payment: PaymentRecord): Promise<void> {
  try {
    const paymentsCollection = collection(db, PAYMENTS_COLLECTION)
    await addDoc(paymentsCollection, {
      applicantName: payment.applicantName,
      nic: payment.nic,
      accountNumber: payment.accountNumber,
      bankName: payment.bankName,
      paymentTotal: payment.paymentTotal,
      date: payment.date,
      paymentStatus: payment.paymentStatus || "received",
      createdAt: serverTimestamp(),
    })
    console.log("Payment record saved successfully")
  } catch (error) {
    console.error("Error saving payment record:", error)
    throw error
  }
}

export async function savePaymentRecords(payments: PaymentRecord[]): Promise<void> {
  try {
    const { getDoc } = await import("firebase/firestore")
    const batch = writeBatch(db)
    const paymentsCollection = collection(db, PAYMENTS_COLLECTION)
    
    // Group payments by userId
    const paymentsByUserId = new Map<string, PaymentRecord[]>()
    payments.forEach((payment) => {
      if (payment.userId) {
        if (!paymentsByUserId.has(payment.userId)) {
          paymentsByUserId.set(payment.userId, [])
        }
        paymentsByUserId.get(payment.userId)!.push(payment)
      }
    })
    
    // Process each user's payments
    for (const [userId, userPayments] of paymentsByUserId.entries()) {
      const paymentRef = doc(paymentsCollection, userId)
      
      // Get existing document to merge with existing payments
      const existingDoc = await getDoc(paymentRef)
      const existingData = existingDoc.data()
      
      // Get existing payments array or create new one
      const existingPayments: PaymentRecord[] = existingData?.payments || []
      
      // Create new payment records for this batch
      // Use Date object instead of serverTimestamp() for array items
      const currentTimestamp = new Date()
      const newPayments = userPayments.map((payment) => ({
        applicantName: payment.applicantName,
        nic: payment.nic,
        accountNumber: payment.accountNumber,
        bankName: payment.bankName,
        paymentTotal: payment.paymentTotal,
        date: payment.date,
        paymentStatus: payment.paymentStatus || "received",
        createdAt: currentTimestamp,
      }))
      
      // Merge existing payments with new ones
      // Check if payment for same date already exists, if so, update it; otherwise add new
      const updatedPayments = [...existingPayments]
      
      newPayments.forEach((newPayment) => {
        const existingIndex = updatedPayments.findIndex(
          (p: any) => p.date === newPayment.date
        )
        
        if (existingIndex >= 0) {
          // Update existing payment for this date
          updatedPayments[existingIndex] = {
            ...updatedPayments[existingIndex],
            ...newPayment,
            updatedAt: currentTimestamp,
          }
        } else {
          // Add new payment
          updatedPayments.push(newPayment)
        }
      })
      
      // Get user info from first payment (all payments for same user should have same info)
      const firstPayment = userPayments[0]
      
      batch.set(paymentRef, {
        userId: userId,
        applicantName: firstPayment.applicantName,
        nic: firstPayment.nic,
        accountNumber: firstPayment.accountNumber,
        bankName: firstPayment.bankName,
        payments: updatedPayments,
        updatedAt: serverTimestamp(),
        ...(existingData?.createdAt ? {} : { createdAt: serverTimestamp() }),
      }, { merge: true })
    }
    
    await batch.commit()
    console.log(`Saved ${payments.length} payment records successfully`)
  } catch (error) {
    console.error("Error saving payment records:", error)
    throw error
  }
}

export async function getAllPaymentRecords(): Promise<PaymentRecord[]> {
  try {
    const paymentsCollection = collection(db, PAYMENTS_COLLECTION)
    const paymentsSnapshot = await getDocs(paymentsCollection)
    
    const payments: PaymentRecord[] = []
    paymentsSnapshot.forEach((doc) => {
      const data = doc.data()
      const userId = doc.id // Document ID is the userId
      
      // Check if document has new structure (payments array) or old structure (single payment)
      if (data.payments && Array.isArray(data.payments)) {
        // New structure: multiple payments per user
        data.payments.forEach((payment: any) => {
          payments.push({
            id: `${userId}_${payment.date}`, // Unique ID combining userId and date
            userId: userId,
            applicantName: data.applicantName || payment.applicantName || "",
            nic: data.nic || payment.nic || "",
            accountNumber: data.accountNumber || payment.accountNumber || "",
            bankName: data.bankName || payment.bankName || "",
            paymentTotal: payment.paymentTotal || 0,
            date: payment.date || "",
            paymentStatus: payment.paymentStatus || "received",
            createdAt: payment.createdAt || data.createdAt,
          })
        })
      } else {
        // Old structure: single payment per document (for backward compatibility)
        payments.push({
          id: doc.id,
          userId: data.userId || doc.id,
          applicantName: data.applicantName || "",
          nic: data.nic || "",
          accountNumber: data.accountNumber || "",
          bankName: data.bankName || "",
          paymentTotal: data.paymentTotal || 0,
          date: data.date || "",
          paymentStatus: data.paymentStatus || "received",
          createdAt: data.createdAt,
        })
      }
    })
    
    // Sort by date descending (newest first)
    payments.sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
    
    return payments
  } catch (error) {
    console.error("Error fetching payment records:", error)
    throw error
  }
}

export async function updateSubadmin(subadminId: string, data: { email: string }): Promise<void> {
  try {
    // Call API route to update email in both Auth and Firestore
    const response = await fetch("/api/admin/update-subadmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subadminId,
        email: data.email,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update subadmin")
    }

    console.log(`Updated subadmin ${subadminId}`)
  } catch (error: any) {
    console.error("Error updating subadmin:", error)
    throw new Error(error.message || "Failed to update subadmin")
  }
}

export async function updateSubadminPassword(subadminId: string, newPassword: string): Promise<void> {
  try {
    // Call API route to update password in Auth
    const response = await fetch("/api/admin/update-subadmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subadminId,
        password: newPassword,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update password")
    }

    console.log(`Updated password for subadmin ${subadminId}`)
  } catch (error: any) {
    console.error("Error updating subadmin password:", error)
    throw new Error(error.message || "Failed to update password")
  }
}

export async function updateUserEmail(userId: string, email: string): Promise<void> {
  try {
    // Call API route to update email in both Auth and Firestore
    const response = await fetch("/api/admin/update-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        email: email,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update user email")
    }

    console.log(`Updated email for user ${userId}`)
  } catch (error: any) {
    console.error("Error updating user email:", error)
    throw new Error(error.message || "Failed to update user email")
  }
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  try {
    // Call API route to update password in Auth
    const response = await fetch("/api/admin/update-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        password: newPassword,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to update password")
    }

    console.log(`Updated password for user ${userId}`)
  } catch (error: any) {
    console.error("Error updating user password:", error)
    throw new Error(error.message || "Failed to update password")
  }
}

export async function deleteSubadmin(subadminId: string): Promise<void> {
  try {
    // Call API route to delete from both Auth and Firestore
    const response = await fetch("/api/admin/delete-user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: subadminId
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to delete subadmin")
    }

    console.log(`Deleted subadmin ${subadminId} from Authentication and Firestore`)
  } catch (error: any) {
    console.error("Error deleting subadmin:", error)
    throw new Error(error.message || "Failed to delete subadmin")
  }
}

export async function deleteUser(userId: string): Promise<void> {
  try {
    // Call API route to delete from both Auth and Firestore
    const response = await fetch("/api/admin/delete-user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to delete user")
    }

    console.log(`Deleted user ${userId} from Authentication and Firestore`)
  } catch (error: any) {
    console.error("Error deleting user:", error)
    throw new Error(error.message || "Failed to delete user")
  }
}

