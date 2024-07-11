"use client";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import Loading from "@/components/Loading";

interface UserData {
  name: string;
  email: string;
  employeeId: string;
  role: string;
}

const AdminDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 dark">
        {loading || !userData ? <Loading/> : <span>
        <div className="w-full text-white max-w-md bg-gray-800 rounded-lg shadow-md p-6 relative">
          <h2 className="text-2xl font-bold mb-2">
            Welcome, Admin {userData.name}
          </h2>
          <p>Email: {userData.email}</p>
          <p>Employee ID: {userData.employeeId}</p>
          <p>Role: {userData.role}</p>

          {/* Add admin-specific features here */}
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-red-600 transition ease-in-out duration-150"
          >
            Sign out
          </button>
        </div>
        </span>}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
