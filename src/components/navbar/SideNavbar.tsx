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

interface NavbarProps {
  children: ReactNode;
}

const SideNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleNavbar = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <span className="w-full h-14 bg-zinc-200 justify-between px-5 items-center border-b-2 border-zinc-300 hidden md:flex">
        <button
          onClick={toggleNavbar}
          data-tip="toggle width"
          className={`text-2xl text-zinc-700 flex tooltip tooltip-right p-2 font-bold rounded-md gap-2`}
        >
          <LuFingerprint className="text-3xl" />
          {!isMinimized && (
            <p className="bg-neutral px-2 rounded-md text-white">HRIS</p>
          )}
        </button>
        <span className="h-10 w-10 flex bg-zinc-500 rounded-full "></span>
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        {/* sidebar */}
        <nav
          className={`flex ${
            isMinimized ? "w-20" : "w-56"
          } bg-zinc-200 h-auto transition-width duration-300 flex-col items-start justify-start p-5 gap-2`}
        >
            <Link
              href={"/user/dashboard"}
              className={`navlink ${
                pathname === "/user/dashboard"
                  ? "bg-neutral text-white"
                  : "text-zinc-700"
              }`}
            >
              <BsBarChartFill className="text-xl" />{" "}
              {!isMinimized && "Dashboard"}
            </Link>
            <Link
              href={"/user/attendance"}
              className={`navlink ${
                pathname === "/user/attendance"
                  ? "bg-neutral text-white"
                  : "text-zinc-700"
              }`}
            >
              <MdTry className="text-xl" /> {!isMinimized && "Attendance"}
            </Link>
            <Link
              href={"/user/payslip"}
              className={`navlink ${
                pathname === "/user/payroll"
                  ? "bg-neutral text-white"
                  : "text-zinc-700"
              }`}
            >
              <MdPayments className="text-xl" /> {!isMinimized && "Payroll"}
            </Link>
            <Link
              href={"/user/history"}
              className={`navlink ${
                pathname === "/user/history"
                  ? "bg-neutral text-white"
                  : "text-zinc-700"
              }`}
            >
              <RiFolderHistoryFill className="text-xl" />{" "}
              {!isMinimized && "History"}
            </Link>
            <Link
              href={"/user/account"}
              className={`navlink ${
                pathname === "/user/account"
                  ? "bg-neutral text-white"
                  : "text-zinc-700"
              }`}
            >
              <FaUserCircle className="text-xl" /> {!isMinimized && "Account"}
            </Link>
            <button
              className="navlink text-zinc-700"
              onClick={() => {
                auth.signOut();
                router.push("/sign-in");
              }}
            >
              <FaSignOutAlt className="text-xl" /> {!isMinimized && "Logout"}
            </button>
        </nav>
        <div className="overflow-y-auto w-full h-full flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
};

export default SideNavbar;
