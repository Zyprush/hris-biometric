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
import { GiHamburgerMenu } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  children: ReactNode;
}

const TopNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* topbar */}
      <span className="w-full h-14 z-50 bg-zinc-200 justify-between px-5 items-center border-b-2 border-zinc-300 flex fixed top-0">
        <button
          data-tip="toggle width"
          className={`text-2xl text-zinc-700 flex tooltip tooltip-right p-2 font-bold rounded-md gap-2`}
        >
          <LuFingerprint className="text-3xl" />
          <p className="bg-neutral px-2 rounded-md text-white">HRIS</p>
        </button>
        <button onClick={toggleMenu} className="text-2xl text-zinc-700 p-2">
          <GiHamburgerMenu />
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
            <Link
              href={"/user/dashboard"}
              className={`navlink ${
                pathname === "/user/dashboard"
                  ? "bg-neutral text-white"
                  : "text-zinc-700"
              }`}
            >
              <BsBarChartFill className="text-xl" /> Dashboard
            </Link>
            <Link
              href={"/user/attendance"}
              className={`navlink ${
                pathname === "/user/attendance"
                  ? "bg-neutral text-white"
                  : "text-zinc-700"
              }`}
            >
              <MdTry className="text-xl" /> Attendance
            </Link>
            <Link
              href={"/user/payslip"}
              className={`navlink ${
                pathname === "/user/payroll"
                  ? "bg-neutral text-white"
                  : "text-zinc-700"
              }`}
            >
              <MdPayments className="text-xl" /> Payroll
            </Link>
            <Link
              href={"/user/history"}
              className={`navlink ${
                pathname === "/user/history"
                  ? "bg-neutral text-white"
                  : "text-zinc-700"
              }`}
            >
              <RiFolderHistoryFill className="text-xl" /> History
            </Link>
            <Link
              href={"/user/account"}
              className={`navlink ${
                pathname === "/user/account"
                  ? "bg-neutral text-white"
                  : "text-zinc-700"
              }`}
            >
              <FaUserCircle className="text-xl" /> Account
            </Link>
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

export default TopNavbar;