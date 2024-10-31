/* eslint-disable @next/next/no-img-element */
"use client";
import { SignedIn } from "@/components/signed-in";
import Userlayout from "@/components/UserLayout";
import { FaClipboardList, FaUserAlt, FaMoneyCheckAlt } from "react-icons/fa";
import Link from "next/link";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import LeaveTaken from "./LeaveTaken";
import Productivity from "./Productivity";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface UserData {
  role: "user" | "admin";
  name: string;
  nickname: string;
  department?: string;
  profilePicUrl?: string;
  attendanceStatus?: string;
  userIdRef: string;
  dailyRate?: number;
}

export default function UserDashboard() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);

  const fetchUserData = useMemo(
    () => async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as UserData);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    },
    [user]
  );

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const QuickActionButton = ({
    icon: Icon,
    onClick,
  }: {
    icon: React.ElementType;
    onClick?: () => void;
  }) => (
    <button
      className="flex items-center justify-center bg-primary text-white p-3 rounded-full hover:bg-neutral transition-colors"
      onClick={onClick}
    >
      <Icon className="w-6 h-6" />
    </button>
  );

  return (
    <UserRouteGuard>
      <SignedIn>
        <Userlayout>
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">
              Welcome, {userData?.nickname || "user"}!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Financial Information */}
              {/* <FinancialOverview
                userIdRef={userData?.userIdRef || ""}
                dailyRate={userData?.dailyRate || 350}
              /> */}

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 dark:bg-gray-800">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-neutral dark:text-white">
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  <Link href="/user/payslip">
                    <QuickActionButton icon={FaMoneyCheckAlt} />
                    <label htmlFor="Payslip">Payslip</label>
                  </Link>
                  <Link href="/user/request"> {/* change from request */}
                    <QuickActionButton icon={FaClipboardList} />
                    <label htmlFor="Leave">Leave</label>
                  </Link>
                  {/*
                  <Link href="/user/request">
                    <QuickActionButton icon={FaUserAlt} />
                    <label htmlFor="Request">Request</label>
                  </Link>
                  */}
                </div>
              </div>

              {/* Leave/Day Off Balance */}
              <LeaveTaken userData={userData} />

              {/* Productivity Chart */}
              <Productivity userIdRef={userData?.userIdRef || ""} />

            </div>
          </div>
        </Userlayout>
      </SignedIn>
    </UserRouteGuard>
  );
}
