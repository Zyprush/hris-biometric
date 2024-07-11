"use client";

import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { sendEmailVerification, User } from "firebase/auth";
import AdminLayout from "@/components/AdminLayout";
import Loading from "@/components/Loading";
import { ToastContainer } from 'react-toastify';
import { successToast, warnToast } from "@/components/toast";
import { SignedIn } from "@/components/signed-in";

interface UserData {
  name: string;
  email: string;
  employeeId: string;
  role: string;
}

const AdminAccount = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const router = useRouter();

  const setAuthChecked = (isChecked: boolean) => {
    // Implement your logic here if needed
    console.log("Auth checked:", isChecked);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
          if (!user.emailVerified) {
            setIsEmailVerified(false);
            warnToast("Your email is not verified. Please check your inbox for a verification email.")
          }
        }
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("User not authenticated. Redirecting to sign-in page...");
        router.push("../sign-in");
      }
      setAuthChecked(true);
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/");
  };

  const handleResendVerification = async () => {
    if (user && !user.emailVerified) {
      try {
        await sendEmailVerification(user);
        successToast("Verification email sent. Please check your inbox.");
      } catch (error) {
        console.error("Error sending verification email:", error);
        warnToast("Failed to send verification email. Please try again later.");
      }
    }
  };

  return (
    <SignedIn>
      <AdminLayout>
        <ToastContainer />
        <div className="flex flex-col items-center justify-center min-h-screen p-4 dark">
          {!userData ? (
            <Loading />
          ) : (
            <span>
              <h2 className="text-2xl font-bold mb-2">
                Welcome, Admin {userData.name}
              </h2>
              <p>Email: {userData.email}</p>
              <p>Employee ID: {userData.employeeId}</p>
              <p>Role: {userData.role}</p>
              {!isEmailVerified && (
                <button
                  onClick={handleResendVerification}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Resend Verification Email
                </button>
              )}
            </span>
          )}
        </div>
      </AdminLayout>
    </SignedIn>
  );
}

export default AdminAccount;