"use client";
import Link from "next/link";
import React, { useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BsBarChartFill } from "react-icons/bs";
import { MdTry, MdPayments } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaUserAlt,
  FaBuilding,
  FaCalendarCheck,
} from "react-icons/fa";
import { LuFingerprint } from "react-icons/lu";
import { auth } from "@/firebase";
import { TiThMenu } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface NavbarProps {
  children: ReactNode;
}

interface NavLinkProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  isActive,
}) => (
  <Link
    href={href}
    className={`navlink ${
      isActive ? "bg-neutral text-white" : "text-zinc-700"
    }`}
  >
    <Icon className="text-xl" /> {label}
  </Link>
);

const AdminTopNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* topbar */}
      <span className="w-full h-14 z-50 bg-zinc-200 justify-between px-3 items-center border-b-2 border-zinc-300 flex fixed top-0">
        <button
          className={`text-xl text-zinc-700 flex p-2 font-bold rounded-md gap-2`}
        >
          <LuFingerprint className="text-2xl" />
          <p className="bg-neutral px-2 rounded-md text-white">HRIS</p>
        </button>
        <button onClick={toggleMenu} className="text-2xl text-zinc-700 p-2">
          {isMenuOpen ? <IoClose /> : <TiThMenu />}
        </button>
      </span>
      {/* sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed h-screen top-14 bottom-0 bg-zinc-200 flex flex-col p-5 gap-2 z-50 items-center justify-center w-full"
          >
            <NavLink
              href="/admin/dashboard"
              icon={BsBarChartFill}
              label="Dashboard"
              isActive={pathname === "/admin/dashboard"}
            />
            <NavLink
              href="/admin/employee"
              icon={FaUserAlt}
              label="Employee"
              isActive={pathname === "/admin/employee"}
            />
            <NavLink
              href="/admin/attendance"
              icon={MdTry}
              label="Attendance"
              isActive={pathname === "/admin/attendance"}
            />
            <NavLink
              href="/admin/payroll"
              icon={MdPayments}
              label="Payroll"
              isActive={pathname === "/admin/payroll"}
            />
            <NavLink
              href="/admin/branch"
              icon={FaBuilding}
              label="Branch"
              isActive={pathname === "/admin/branch"}
            />
            <NavLink
              href="/admin/history"
              icon={RiFolderHistoryFill}
              label="History"
              isActive={pathname === "/admin/history"}
            />
            <NavLink
              href="/admin/account"
              icon={FaUserCircle}
              label="Account"
              isActive={pathname === "/admin/account"}
            />
            <button
              className="navlink text-zinc-700"
              onClick={() => {
                auth.signOut();
                router.push("/sign-in");
              }}
            >
              <FaSignOutAlt className="text-xl" /> Logout
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
      <div className="overflow-y-auto w-full mt-14">{children}</div>
    </div>
  );
};

export default AdminTopNavbar;
