"use client";
import Link from "next/link";
import React, { useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BsBarChartFill } from "react-icons/bs";
import { FaUserAlt } from "react-icons/fa";
import { MdTry } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { FaBuilding } from "react-icons/fa6";
import { RiFolderHistoryFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { LuFingerprint } from "react-icons/lu";
import { auth } from "@/firebase";

interface NavbarProps {
  children: ReactNode;
}

const EmployeeLayout: React.FC<NavbarProps> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleNavbar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="h-screen w-screen flex bg-slate-100 overflow-hidden">
      <div
        className={`flex ${
          isMinimized ? "w-20" : "w-56"
        } h-screen bg-zinc-200 transition-width duration-300 justify-start items-start`}
      >
        <nav className="flex flex-col items-start justify-start p-5 gap-2 mx-auto">
          <button
            onClick={toggleNavbar}
            data-tip="toggle width"
            className={`text-2xl text-zinc-700 flex mb-5 tooltip tooltip-right m-auto p-2 font-bold rounded-md gap-2`}
          >
            <LuFingerprint className="text-3xl" /> {!isMinimized && <p className="bg-neutral px-2 rounded-md text-white">HRIS</p>}
          </button>
          <Link href={"/admin/dashboard"} className={`navlink ${pathname === "/admin/dashboard" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <BsBarChartFill className="text-xl" /> {!isMinimized && "Dashboard"}
          </Link>
          <Link href={"/admin/employee"} className={`navlink ${pathname === "/admin/employee" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <FaUserAlt className="text-xl" /> {!isMinimized && "Employee"}
          </Link>
          <Link href={"/admin/attendance"} className={`navlink ${pathname === "/admin/attendance" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <MdTry className="text-xl" /> {!isMinimized && "Attendance"}
          </Link>
          <Link href={"/admin/payroll"} className={`navlink ${pathname === "/admin/payroll" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <MdPayments className="text-xl" /> {!isMinimized && "Payroll"}
          </Link>
          <Link href={"/admin/branch"} className={`navlink ${pathname === "/admin/branch" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <FaBuilding className="text-xl" /> {!isMinimized && "Branch"}
          </Link>
          <Link href={"/admin/history"} className={`navlink ${pathname === "/admin/history" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <RiFolderHistoryFill className="text-xl" />{" "}
            {!isMinimized && "History"}
          </Link>
          <Link href={"/admin/account"} className={`navlink ${pathname === "/admin/account" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <FaUserCircle className="text-xl" /> {!isMinimized && "Account"}
          </Link>
          <button className="navlink text-zinc-700" onClick={() => { auth.signOut(); router.push("/sign-in"); }}>
            <FaSignOutAlt className="text-xl" /> {!isMinimized && "Logout"}
          </button>
        </nav>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default EmployeeLayout;
