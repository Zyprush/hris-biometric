/* eslint-disable @next/next/no-img-element */
"use client";
import { SignedIn } from "@/components/signed-in";
import Userlayout from "@/components/UserLayout";
import {
  FaClipboardList,
  FaUserAlt,
  FaMoneyCheckAlt,
} from "react-icons/fa";
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
import TeamStatus from "./TeamStatus";
import Productivity from "./Productivity";
import FinancialOverview from "./FinancialOverview";

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
  userIdRef?: string;
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
    label,
    onClick,
  }: {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
  }) => (
    <button
      className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-neutral transition-colors"
      onClick={onClick}
    >
      <Icon />
      {label}
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
             <FinancialOverview userIdRef={userData?.userIdRef || ""} dailyRate={userData?.dailyRate || 350}/>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800 ">
                <h2 className="text-xl font-semibold mb-4 text-neutral dark:text-white">
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Link href="/user/request">
                    <QuickActionButton icon={FaUserAlt} label="Leave Request" />
                  </Link>
                  <Link href="/user/payslip">
                    <QuickActionButton
                      icon={FaMoneyCheckAlt}
                      label="View Payslip"
                    />
                  </Link>
                </div>
              </div>

              {/* Leave/Day Off Balance */}
              <LeaveTaken userData={userData} />

              {/* Productivity Chart */}
              <Productivity userIdRef={userData?.userIdRef || ""} />

              {/* Team Status */}
              <TeamStatus userData={userData} />
            </div>

            {/* Original Dashboard Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <DashboardLink
                href="/user/attendance"
                icon={FaClipboardList}
                title="Attendance"
                description="Track your daily attendance records and monitor your punctuality over time here."
              />
              <DashboardLink
                href="/user/request"
                icon={FaUserAlt}
                title="Leave Request"
                description="Submit your leave requests and check the status of your previous requests here."
              />
              <DashboardLink
                href="/user/payslip"
                icon={FaMoneyCheckAlt}
                title="View Pay Slip"
                description="Access your monthly pay slips and review your salary and bonus details here."
              />
            </div>
          </div>
        </Userlayout>
      </SignedIn>
    </UserRouteGuard>
  );
}

interface DashboardLinkProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const DashboardLink: React.FC<DashboardLinkProps> = ({
  href,
  icon: Icon,
  title,
  description,
}) => (
  <Link
    href={href}
    className="bg-white text-zinc-700 rounded-lg dark:bg-gray-800 dark:border-gray-800 p-8 gap-3 flex flex-col border hover:bg-neutral hover:text-white group transition-colors dark:hover:bg-neutral "
  >
    <span className="flex gap-3">
      <Icon className="text-3xl dark:text-zinc-200" />
      <p className="text-2xl font-bold dark:text-zinc-300">{title}</p>
    </span>
    <p className="text-sm text-zinc-500 group-hover:text-zinc-200 dark:text-zinc-300">
      {description}
    </p>
  </Link>
);
