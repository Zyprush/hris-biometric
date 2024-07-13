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

const fetchUserData = async (user: any, setUserData: (data: UserData | null) => void) => {
  if (user) {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      setUserData(userDocSnap.data() as UserData);
    }
  }
};

const LoadingComponent = () => (
  <Userlayout>
    <FingerprintLoading />
  </Userlayout>
);

const RedirectToAdmin = ({ router }: { router: any }) => {
  useEffect(() => {
    router.push("/admin-dashboard");
  }, [router]);

  return null;
};

const DashboardLink = ({ href, icon: Icon, title, description }: { href: string, icon: any, title: string, description: string }) => (
  <Link href={href} className="bg-white text-zinc-700 rounded-lg p-8 gap-3 flex flex-col border max-w-[23rem] hover:bg-neutral hover:text-white group">
    <span className="flex gap-3">
      <Icon className="text-3xl" />
      <p className="text-2xl font-bold ">{title}</p>
    </span>
    <p className="text-sm text-zinc-500 group-hover:text-zinc-200">{description}</p>
  </Link>
);

export default function UserDashboard() {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserData(user, setUserData);
  }, [user]);

  if (loading || !userData) {
    return <LoadingComponent />;
  }

  if (userData && userData.role === "admin") {
    return <RedirectToAdmin router={router} />;
  }

  return (
    <SignedIn>
      <Userlayout>
        <div className="container flex flex-col items-center justify-center p-8 gap-10">
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
      </Userlayout>
    </SignedIn>
  );
}