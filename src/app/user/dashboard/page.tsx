"use client";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SignedIn } from "@/components/signed-in";
import Userlayout from "@/components/UserLayout";
import FingerprintLoading from "@/components/Loading";
import { FaClipboardList, FaUserAlt, FaMoneyCheckAlt } from "react-icons/fa";
import Link from "next/link";

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
    return (
      <Userlayout>
        <FingerprintLoading />
      </Userlayout>
    );
  }

  if (userData && userData.role === "admin") {
    router.push("/admin-dashboard");
    return null;
  }

  return (
    <SignedIn>
      <Userlayout>
        <div className="flex flex-col items-center justify-center p-8 gap-10 bg-white shadow-lg rounded-lg">
          <Link href="/user/attendance" className="card max-w-80 border-2 rounded-lg mx-auto flex items-center justify-center text-lg font-semibold p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <FaClipboardList className="mr-3 text-2xl" />
            View Attendance
          </Link>
          <Link href="/user/request" className="card max-w-80 border-2 rounded-lg mx-auto flex items-center justify-center text-lg font-semibold p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <FaUserAlt className="mr-3 text-2xl" />
            Leave Request
          </Link>
          <Link href="/user/payslip" className="card max-w-80 border-2 rounded-lg mx-auto flex items-center justify-center text-lg font-semibold p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
            <FaMoneyCheckAlt className="mr-3 text-2xl" />
            View Pay Slip
          </Link>
        </div>
      </Userlayout>
    </SignedIn>
  );
}