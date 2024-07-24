"use client";
import Link from "next/link";
import React, { useState, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BsBarChartFill } from "react-icons/bs";
import { MdTry, MdPayments } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { auth, db } from "@/firebase";
import { TiThMenu } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import profileMale from "../../../public/img/profile-male.jpg";
import Account from "./Account";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import Loading from "../Loading";

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

const TopNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  if (loading) return <Loading />;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* topbar */}
      <span className="w-full h-14 z-50 bg-zinc-200 justify-between px-3 items-center border-b-2 border-zinc-300 flex fixed top-0">
        <div className="dropdown dropdown-start">
          <div
            tabIndex={0}
            role="button"
            className="h-10 w-10 flex items-center justify-center overflow-hidden border-2 border-zinc-500 bg-zinc-500 rounded-full"
          >
            <img
              src={userData?.profilePicUrl || "/img/profile-male.jpg"}
              alt="profile"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <Account />
        </div>
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
              href="/user/dashboard"
              icon={BsBarChartFill}
              label="Dashboard"
              isActive={pathname === "/user/dashboard"}
            />
            <NavLink
              href="/user/request"
              icon={MdTry}
              label="Leave"
              isActive={pathname === "/user/request"}
            />
            <NavLink
              href="/user/payslip"
              icon={MdPayments}
              label="Payslip"
              isActive={pathname === "/user/payroll"}
            />
            <NavLink
              href="/user/history"
              icon={RiFolderHistoryFill}
              label="History"
              isActive={pathname === "/user/history"}
            />
          </motion.nav>
        )}
      </AnimatePresence>
      <div className="overflow-y-auto w-full pt-14">{children}</div>
    </div>
  );
};

export default TopNavbar;
