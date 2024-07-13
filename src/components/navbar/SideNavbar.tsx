"use client";
import Link from "next/link";
import React, { useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BsBarChartFill } from "react-icons/bs";
import { MdTry, MdPayments } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { LuFingerprint } from "react-icons/lu";
import { auth } from "@/firebase";

interface NavbarProps {
  children: ReactNode;
}

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isMinimized: boolean;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, label, isMinimized, isActive }) => (
  <Link
    href={href}
    className={`navlink ${isActive ? "bg-neutral text-white" : "text-zinc-700"}`}
  >
    <Icon className="text-xl" /> {!isMinimized && label}
  </Link>
);

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
          className="text-2xl text-zinc-700 flex tooltip tooltip-right p-2 font-bold rounded-md gap-2"
        >
          <LuFingerprint className="text-3xl" />
          {!isMinimized && (
            <p className="bg-neutral px-2 rounded-md text-white">HRIS</p>
          )}
        </button>
        <span className="h-10 w-10 flex bg-zinc-500 rounded-full "></span>
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        <nav
          className={`flex ${
            isMinimized ? "w-20" : "w-56"
          } bg-zinc-200 h-auto transition-width duration-300 flex-col items-start justify-start p-5 gap-2`}
        >
          <NavLink
            href="/user/dashboard"
            icon={BsBarChartFill}
            label="Dashboard"
            isMinimized={isMinimized}
            isActive={pathname === "/user/dashboard"}
          />
          <NavLink
            href="/user/attendance"
            icon={MdTry}
            label="Attendance"
            isMinimized={isMinimized}
            isActive={pathname === "/user/attendance"}
          />
          <NavLink
            href="/user/payslip"
            icon={MdPayments}
            label="Payslip"
            isMinimized={isMinimized}
            isActive={pathname === "/user/payslip"}
          />
          <NavLink
            href="/user/history"
            icon={RiFolderHistoryFill}
            label="History"
            isMinimized={isMinimized}
            isActive={pathname === "/user/history"}
          />
          <NavLink
            href="/user/account"
            icon={FaUserCircle}
            label="Account"
            isMinimized={isMinimized}
            isActive={pathname === "/user/account"}
          />
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
        <div className="overflow-y-auto w-full">{children}</div>
      </div>
    </div>
  );
};

export default SideNavbar;