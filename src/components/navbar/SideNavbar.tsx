/* eslint-disable @next/next/no-img-element */
import React, { useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BsBarChartFill } from "react-icons/bs";
import { MdTry, MdPayments } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { FaBell } from "react-icons/fa";
import { auth, db } from "@/firebase";
import Account from "./Account";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import Loading from "../Loading";
import Image from "next/image";
import { NavLink } from "./AdminSideNavbar";
import { IoIosArrowBack } from "react-icons/io";
import { useTheme } from "next-themes";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import Notification from "../Notification";

interface NavbarProps {
  children: ReactNode;
}

const SideNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const [showNotif, setShowNotif] = useState<boolean>(false);
  const [showAcc, setShowAcc] = useState<boolean>(false);

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

  const toggleNavbar = () => {
    setIsMinimized(!isMinimized);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (loading) return <Loading />;

  return (
    <div className="h-screen w-full flex flex-col">
      <span className="w-full h-14 bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-800 dark:to-gray-900 custom-shadow justify-between px-5 items-center border-b border-zinc-300 dark:border-zinc-800 hidden md:flex">
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
          <details className="dropdown dropdown-end">
            <summary className="btn btn-ghost btn-circle">
              <div className="indicator p-2 rounded-full border border-neutral-200 dark:border-white/[0.2] bg-gray-300 dark:bg-gray-900 text-zinc-700 dark:text-zinc-100">
                <FaBell className="h-5 w-5 text-neutral dark:text-zinc-200" />
                {showNotif && (
                  <span className="badge badge-xs badge-primary indicator-item mr-1 mt-1  "></span>
                )}
              </div>
            </summary>
            <Notification
              userData={userData}
              user={user}
              setShowNotif={setShowNotif}
            />
          </details>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-neutral-200 dark:border-white/[0.2] bg-gray-300 dark:bg-gray-900 text-zinc-700 dark:text-zinc-100"
          >
            {theme === "dark" ? (
              <IoSunnyOutline className="h-5 w-5" />
            ) : (
              <IoMoonOutline className="h-5 w-5" />
            )}
          </button>
          <details className="dropdown dropdown-end" >
            <summary
              tabIndex={0}
              role="button"
              className="h-10 w-10 hidden md:flex items-center justify-center overflow-hidden border-2 border-primary bg-primary rounded-full"
            >
              <img
                src={userData?.profilePicUrl || "/img/profile-male.jpg"}
                alt="profile"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </summary>
            <Account userData={userData} />
          </details>
        </div>
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        <nav
          className={`flex ${
            isMinimized ? "w-20" : "w-56"
          } bg-gray-100 dark:bg-gray-800 dark:to-gray-900 custom-shadow relative h-auto transition-width duration-300 flex-col items-start justify-start pt-5 p-4 gap-2`}
        >
          <NavLink
            href="/user/dashboard"
            icon={BsBarChartFill}
            label="Dashboard"
            isMinimized={isMinimized}
            isActive={pathname === "/user/dashboard"}
          />
          <NavLink
            href="/user/request"
            icon={MdTry}
            label="Leave"
            isMinimized={isMinimized}
            isActive={pathname === "/user/request"}
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
          <button
            onClick={toggleNavbar}
            className={`flex items-center p-1 border bg-zinc-100 border-zinc-300 dark:border-zinc-700 absolute -right-4 dark:bg-gray-800 bottom-14 text-zinc-400 rounded-full transition-all duration-300 ${
              isMinimized ? "transform rotate-180" : ""
            }`}
          >
            <IoIosArrowBack className="text-xl" />
          </button>
        </nav>
        <div className="overflow-y-auto w-full h-full flex dark:bg-gray-900 bg-none ">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;
