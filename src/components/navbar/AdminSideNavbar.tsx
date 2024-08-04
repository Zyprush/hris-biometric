"use client";
import Link from "next/link";
import React, { useState, ReactNode, Suspense, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BsBarChartFill } from "react-icons/bs";
import { MdTry, MdPayments } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { FaUserAlt, FaBuilding, FaBell } from "react-icons/fa";
import Account from "./Account";
import Loading from "../Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import Image from "next/image";
import { IoIosArrowBack } from "react-icons/io";
import { useTheme } from "next-themes";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
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

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  icon: Icon,
  label,
  isMinimized,
  isActive,
}) => (
  <Link
    href={href}
    className={`w-full items-center justify-start flex gap-3 text-sm font-[600] p-3 hover:bg-secondary rounded-md hover:text-white transition-all duration-300 hover:dark:text-zinc-800 hover:shadow-md hover:drop-shadow-sm ${isActive ? "bg-neutral text-white" : "text-zinc-700 dark:text-zinc-400"
      }`}
  >
    <span className={`w-auto ${isMinimized && " mx-auto"}`}>
      <Icon className="text-xl" />
    </span>
    {!isMinimized && label}
  </Link>
);

const AdminSideNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();

  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);

  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(theme === 'dark');
  const handleToggle = () => {
    setChecked(!checked);
    toggleTheme();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (loading) return <Loading />;

  const toggleNavbar = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <span className="w-full h-14 bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 custom-shadow justify-between px-5 items-center border-b border-zinc-300 dark:border-zinc-700 hidden md:flex">
        <span className="flex items-center text-white font-semibold rounded-md gap-2">
          <Image
            width={50}
            height={50}
            src={"/img/smarthr-logo.png"}
            alt="logo"
            className="w-14 drop-shadow-lg"
          />
          {!isMinimized && <p className="logo-banner">SMART HR</p>}
        </span>
        <div className="flex items-center gap-4">
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator p-2 rounded-full border border-neutral-200 dark:border-white/[0.2] bg-gray-300 dark:bg-gray-900 text-zinc-700 dark:text-zinc-100">
                <FaBell className="h-5 w-5 text-neutral dark:text-zinc-200" />
                <span className="badge badge-xs badge-primary indicator-item mr-1 mt-1  "></span>
              </div>
            </button>
            <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
              <div className="card-body">
                <span className="font-bold text-lg">8 New Notifications</span>
                <span className="text-info">Dummy notification content</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">View all</button>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-neutral-200 dark:border-white/[0.2] bg-gray-300 dark:bg-gray-900 text-zinc-700 dark:text-zinc-100"
          >
            {theme === 'dark' ? <IoSunnyOutline className="h-5 w-5" /> : <IoMoonOutline className="h-5 w-5" />}
          </button>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="h-10 w-10 flex items-center justify-center overflow-hidden border-2 border-primary bg-primary rounded-full"
            >
              <img
                src={userData?.profilePicUrl || "/img/profile-admin.jpg"}
                alt="profile"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <Account />
          </div>
        </div>
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        <nav
          className={`flex ${isMinimized ? "w-20" : "w-56"
            } bg-gray-100 dark:bg-gray-800 dark:to-gray-900 custom-shadow dark:border-r dark:border-zinc-700  relative h-auto transition-width duration-300 flex-col items-start justify-start pt-5 p-4 gap-2`}
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
          <button
            onClick={toggleNavbar}
            className={`flex items-center p-1 border bg-zinc-100 border-zinc-300 dark:border-zinc-700 absolute -right-4 dark:bg-gray-800 bottom-14 text-zinc-400  rounded-full transition-all duration-300 ${isMinimized ? 'transform rotate-180' : ''}`}
          >
            <IoIosArrowBack className="text-xl" />
          </button>
        </nav>
        <div className="overflow-y-auto w-full dark:bg-gray-900 bg-none flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminSideNavbar;
