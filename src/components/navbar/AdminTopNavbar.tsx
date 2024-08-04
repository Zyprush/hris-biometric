/* eslint-disable @next/next/no-img-element */
"use client";
import { auth, db } from "@/firebase";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { BsBarChartFill } from "react-icons/bs";
import {
  FaBell,
  FaBuilding,
  FaSignOutAlt,
  FaUserAlt,
  FaUserCircle,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdPayments, MdTry } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";
import Account from "./Account";
import Loading from "../Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import Notification from "../Notification";

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
      isActive
        ? "bg-neutral text-white"
        : "text-zinc-700 dark:text-zinc-300"
    }`}
  >
    <Icon className="text-xl" /> {label}
  </Link>
);

const AdminTopNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [showNotif, setShowNotif] = useState<boolean>(false);

  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);

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

  if (loading) return <Loading/>;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="h-screen w-screen flex flex-col dark:bg-gray-900">
      {/* topbar */}
      <span className="w-full h-14 z-50 bg-zinc-200 dark:bg-gray-800 justify-between px-3 items-center border-b-2 border-zinc-300 dark:border-zinc-700 flex fixed top-0">
        <div className="dropdown dropdown-start">
          <div
            tabIndex={0}
            role="button"
            className="h-10 w-10 flex items-center justify-center overflow-hidden border-2 border-zinc-500 dark:border-zinc-400 bg-zinc-500 dark:bg-zinc-600 rounded-full"
          >
            <img
              src={userData?.profilePicUrl || "/img/profile-admin.jpg"}
              alt="profile"
              width={40} height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <Account userData={userData} />
        </div>
        <div className="dropdown dropdown-end mr-0 ml-auto">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator p-2 rounded-full border border-neutral-200 dark:border-white/[0.2] bg-gray-300 dark:bg-gray-900 text-zinc-700 dark:text-zinc-100">
                <FaBell className="h-5 w-5 text-neutral dark:text-zinc-200" />
                {showNotif && (
                  <span className="badge badge-xs badge-primary indicator-item mr-1 mt-1  "></span>
                )}
              </div>
            </button>
            <Notification userData={userData} user={user} setShowNotif={setShowNotif} />
          </div>
        <button onClick={toggleMenu} className="text-2xl text-zinc-700 dark:text-zinc-300 p-2">
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
            className="fixed h-screen top-14 bottom-0 bg-zinc-200 dark:bg-gray-800 flex flex-col p-5 gap-2 z-50 items-center justify-center w-full"
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

          </motion.nav>
        )}
      </AnimatePresence>
      <div className="overflow-y-auto w-full mt-14 dark:bg-gray-900">{children}</div>
    </div>
  );
};

export default AdminTopNavbar;