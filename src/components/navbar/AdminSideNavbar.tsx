"use client";
import Link from "next/link";
import React, { useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BsBarChartFill } from "react-icons/bs";
import { MdTry, MdPayments } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import {
  FaUserAlt,
  FaBuilding,
} from "react-icons/fa";
import profileMale from "../../../public/img/profile-male.jpg";
import Image from "next/image";
import { GrFingerPrint } from "react-icons/gr";
import Account from "./Account";
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

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  isMinimized,
  isActive,
}) => (
  <Link
    href={href}
    className={`navlink ${
      isActive ? "bg-neutral text-white" : "text-zinc-700"
    }`}
  >
    <Icon className="text-xl" /> {!isMinimized && label}
  </Link>
);

const AdminSideNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
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
          className=" flex items-center text-white tooltip tooltip-right font-semibold rounded-md gap-2"
        >
          <span className="bg-zinc-800 rounded-full p-2">
            <GrFingerPrint className="text-3xl text-white" />
          </span>
          {!isMinimized && (
            <p className="px-3 py-1 rounded-md text-neutral border-2 border-neutral font-bold text-xs">SMART HR</p>
          )}
        </button>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="h-10 w-10 flex items-center justify-center overflow-hidden border-2 border-zinc-500 bg-zinc-500 rounded-full"
          >
            <Image src={profileMale} alt="Logo.png" width={40} height={40} />
          </div>
         <Account/>
        </div>
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        <nav
          className={`flex ${
            isMinimized ? "w-20" : "w-56"
          } bg-zinc-200 h-auto transition-width duration-300 flex-col items-start justify-start p-5 gap-2`}
        >
          <NavLink
            href="/admin/dashboard"
            icon={BsBarChartFill}
            label="Dashboard"
            isMinimized={isMinimized}
            isActive={pathname === "/admin/dashboard"}
          />
          <NavLink
            href="/admin/employee"
            icon={FaUserAlt}
            label="Employee"
            isMinimized={isMinimized}
            isActive={pathname === "/admin/employee"}
          />
          <NavLink
            href="/admin/attendance"
            icon={MdTry}
            label="Attendance"
            isMinimized={isMinimized}
            isActive={pathname === "/admin/attendance"}
          />
          <NavLink
            href="/admin/payroll"
            icon={MdPayments}
            label="Payroll"
            isMinimized={isMinimized}
            isActive={pathname === "/admin/payroll"}
          />

          <NavLink
            href="/admin/branch"
            icon={FaBuilding}
            label="Branch"
            isMinimized={isMinimized}
            isActive={pathname === "/admin/branch"}
          />
          <NavLink
            href="/admin/history"
            icon={RiFolderHistoryFill}
            label="History"
            isMinimized={isMinimized}
            isActive={pathname === "/admin/history"}
          />
        </nav>
        <div className="overflow-y-auto w-full h-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminSideNavbar;
