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

const AdminLayout: React.FC<NavbarProps> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const router = useRouter();

  const toggleNavbar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="h-screen w-screen flex bg-slate-100">
      <div
        className={`flex ${
          isMinimized ? "w-20" : "w-56"
        } h-screen bg-zinc-200 transition-width duration-300 justify-start items-start`}
      >
        <nav className="flex flex-col items-start justify-start p-5 gap-2 mx-auto">
          <button
            onClick={toggleNavbar}
            data-tip="toggle width"
            className={`text-2xl flex mb-5 tooltip tooltip-right m-auto p-2 font-bold rounded-md gap-2`}
          >
            <LuFingerprint className="text-3xl" /> {!isMinimized && "HRIS"}
          </button>
          <Link href={"/admin/dashboard"} className="navlink">
            <BsBarChartFill className="text-xl" /> {!isMinimized && "Dashboard"}
          </Link>
          <Link href={"/employee"} className="navlink">
            <FaUserAlt className="text-xl" /> {!isMinimized && "Employee"}
          </Link>
          <Link href={"/attendance"} className="navlink">
            <MdTry className="text-xl" /> {!isMinimized && "Attendance"}
          </Link>
          <Link href={"/payroll"} className="navlink">
            <MdPayments className="text-xl" /> {!isMinimized && "Payroll"}
          </Link>
          <Link href={"/branch"} className="navlink">
            <FaBuilding className="text-xl" /> {!isMinimized && "Branch"}
          </Link>
          <Link href={"/history"} className="navlink">
            <RiFolderHistoryFill className="text-xl" />{" "}
            {!isMinimized && "History"}
          </Link>
          <Link href={"/account"} className="navlink">
            <FaUserCircle className="text-xl" /> {!isMinimized && "Account"}
          </Link>
          <button className="navlink" onClick={() => { auth.signOut(); router.push("/sign-in"); }}>
            <FaSignOutAlt className="text-xl" /> {!isMinimized && "Logout"}
          </button>
        </nav>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AdminLayout;
