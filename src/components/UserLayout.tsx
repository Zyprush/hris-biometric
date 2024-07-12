"use client";
import Link from "next/link";
import React, { useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BsBarChartFill } from "react-icons/bs";
import { MdTry } from "react-icons/md";
import { MdPayments } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { LuFingerprint } from "react-icons/lu";
import { auth } from "@/firebase";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
  children: ReactNode;
}

const UserLayout: React.FC<NavbarProps> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleNavbar = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-slate-100 overflow-hidden">
      <div
        className={`flex ${
          isMinimized ? "w-20" : "w-56"
        } h-screen bg-zinc-200 transition-width duration-300 justify-start items-start hidden md:flex`}
      >
        <nav className="flex flex-col items-start justify-start p-5 gap-2 mx-auto">
          <button
            onClick={toggleNavbar}
            data-tip="toggle width"
            className={`text-2xl text-zinc-700 flex mb-5 tooltip tooltip-right m-auto p-2 font-bold rounded-md gap-2`}
          >
            <LuFingerprint className="text-3xl" /> {!isMinimized && <p className="bg-neutral px-2 rounded-md text-white">HRIS</p>}
          </button>
          <Link href={"/user/dashboard"} className={`navlink ${pathname === "/user/dashboard" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <BsBarChartFill className="text-xl" /> {!isMinimized && "Dashboard"}
          </Link>
          <Link href={"/user/attendance"} className={`navlink ${pathname === "/user/attendance" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <MdTry className="text-xl" /> {!isMinimized && "Attendance"}
          </Link>
          <Link href={"/user/payslip"} className={`navlink ${pathname === "/user/payroll" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <MdPayments className="text-xl" /> {!isMinimized && "Payroll"}
          </Link>
          <Link href={"/user/history"} className={`navlink ${pathname === "/user/history" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <RiFolderHistoryFill className="text-xl" />{" "}
            {!isMinimized && "History"}
          </Link>
          <Link href={"/user/account"} className={`navlink ${pathname === "/user/account" ? "bg-neutral text-white" : "text-zinc-700"}`}>
            <FaUserCircle className="text-xl" /> {!isMinimized && "Account"}
          </Link>
          <button className="navlink text-zinc-700" onClick={() => { auth.signOut(); router.push("/sign-in"); }}>
            <FaSignOutAlt className="text-xl" /> {!isMinimized && "Logout"}
          </button>
        </nav>
      </div>
      <div className="md:hidden flex flex-col bg-zinc-200">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-2">
            <LuFingerprint className="text-3xl" />
            <p className="bg-neutral px-2 rounded-md text-white">HRIS</p>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="text-2xl text-zinc-700"
          >
            {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <nav className="flex flex-col items-start justify-start p-5 gap-2 bg-zinc-200">
            <Link href={"/user/dashboard"} className={`navlink ${pathname === "/user/dashboard" ? "bg-neutral text-white" : "text-zinc-700"}`}>
              <BsBarChartFill className="text-xl" /> Dashboard
            </Link>
            <Link href={"/user/attendance"} className={`navlink ${pathname === "/user/attendance" ? "bg-neutral text-white" : "text-zinc-700"}`}>
              <MdTry className="text-xl" /> Attendance
            </Link>
            <Link href={"/user/payslip"} className={`navlink ${pathname === "/user/payroll" ? "bg-neutral text-white" : "text-zinc-700"}`}>
              <MdPayments className="text-xl" /> Payroll
            </Link>
            <Link href={"/user/history"} className={`navlink ${pathname === "/user/history" ? "bg-neutral text-white" : "text-zinc-700"}`}>
              <RiFolderHistoryFill className="text-xl" /> History
            </Link>
            <Link href={"/user/account"} className={`navlink ${pathname === "/user/account" ? "bg-neutral text-white" : "text-zinc-700"}`}>
              <FaUserCircle className="text-xl" /> Account
            </Link>
            <button className="navlink text-zinc-700" onClick={() => { auth.signOut(); router.push("/sign-in"); }}>
              <FaSignOutAlt className="text-xl" /> Logout
            </button>
          </nav>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
};

export default UserLayout;
