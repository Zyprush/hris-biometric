"use client";
import { SignedIn } from "@/components/signed-in";
import Userlayout from "@/components/UserLayout";
import { FaClipboardList, FaUserAlt, FaMoneyCheckAlt } from "react-icons/fa";
import Link from "next/link";
import { UserRouteGuard } from "@/components/UserRouteGuard";

export default function UserDashboard() {

  interface UserData {
    name: string;
    email: string;
    employeeId: string;
    role: string;
  }


  const DashboardLink = ({
    href,
    icon: Icon,
    title,
    description,
  }: {
    href: string;
    icon: any;
    title: string;
    description: string;
  }) => (
    <Link
      href={href}
      className="bg-white text-zinc-700 rounded-lg p-8 gap-3 flex flex-col border max-w-[23rem] hover:bg-neutral hover:text-white group"
    >
      <span className="flex gap-3">
        <Icon className="text-3xl" />
        <p className="text-2xl font-bold ">{title}</p>
      </span>
      <p className="text-sm text-zinc-500 group-hover:text-zinc-200">
        {description}
      </p>
    </Link>
  );
console.log("RENDER")

  return (
    <UserRouteGuard>
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
    </UserRouteGuard>
  );
}
