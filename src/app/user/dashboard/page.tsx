"use client";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  employeeId: string;
  role: string;
}

export default function UserDashboard() {
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

  if (loading || !userData) {
    return <IconFidgetSpinner className="animate-spin w-8 h-8 mx-auto" />;
  }

  if (userData.role === "admin") {
    router.push("/admin-dashboard");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 dark">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6 relative">
        <h2 className="text-2xl font-bold mb-2">Welcome, {userData.name}</h2>
        <p>Email: {userData.email}</p>
        <p>Employee ID: {userData.employeeId}</p>
        <button
          onClick={() => auth.signOut()}
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-red-600 transition ease-in-out duration-150"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}