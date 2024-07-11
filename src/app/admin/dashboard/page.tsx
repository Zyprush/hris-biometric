"use client";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import Loading from "@/components/Loading";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            toast.warn("Your email is not verified. Please check your inbox for a verification email.", {
              position: "top-right",
              autoClose: false,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: false,
              progress: undefined,
            });
          }
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/");
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 dark">
        {loading || !userData ? (
          <Loading/>
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
