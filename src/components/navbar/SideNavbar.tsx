import Link from "next/link";
import React, { useState, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BsBarChartFill } from "react-icons/bs";
import { MdTry, MdPayments } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { auth, db } from "@/firebase";
import Account from "./Account";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import Loading from "../Loading";
import Image from "next/image";
import { NavLink } from "./AdminSideNavbar";

interface NavbarProps {
  children: ReactNode;
}

const SideNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
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

  const toggleNavbar = () => {
    setIsMinimized(!isMinimized);
  };

  if (loading) return <Loading />;

  return (
    <div className="h-screen w-full flex flex-col">
      <span className="w-full h-14 bg-white justify-between px-5 custom-shadow items-center border-b border-zinc-300 hidden md:flex">
        <button
          onClick={toggleNavbar}
          data-tip="toggle width"
          className=" flex items-center text-white tooltip tooltip-right font-semibold rounded-md gap-2"
        >
          <Image
            width={50}
            height={50}
            src={"/img/smarthr-logo.png"}
            alt="logo"
            className="w-14 drop-shadow-lg"
          />
          {!isMinimized && <p className="logo-banner">SMART HR</p>}
        </button>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="h-10 w-10 flex items-center justify-center overflow-hidden border-2 border-zinc-500 bg-zinc-500 rounded-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        <nav
          className={`flex ${
            isMinimized ? "w-20" : "w-56"
          } bg-white custom-shadow h-auto custom-shadow transition-width duration-300 flex-col items-start justify-start p-4 pt-5 gap-2`}
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
        </nav>
        <div className="overflow-y-auto w-full">{children}</div>
      </div>
    </div>
  );
};

export default SideNavbar;
