"use client";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import Loading from "@/components/Loading";
import { ToastContainer } from 'react-toastify';
import { warnToast } from "@/components/toast";

interface UserData {
  name: string;
  email: string;
  employeeId: string;
  role: string;
}

const AdminDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();

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


  return (
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
          </span>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;