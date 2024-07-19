import Link from "next/link";
import React, { useState, ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BsBarChartFill } from "react-icons/bs";
import { MdTry, MdPayments } from "react-icons/md";
import { RiFolderHistoryFill } from "react-icons/ri";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { auth, db } from "@/firebase";
import profileMale from "../../../public/img/profile-male.jpg"
import Image from "next/image";
import { GrFingerPrint } from "react-icons/gr";
import Account from "./Account";
import { UserRouteGuard } from "../UserRouteGuard";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";


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
    className={`navlink ${isActive ? "bg-neutral text-white" : "text-zinc-700"
      }`}
  >
    <Icon className="text-xl" /> {!isMinimized && label}
  </Link>
);

const SideNavbar: React.FC<NavbarProps> = ({ children }) => {
  const [isMinimized, setIsMinimized] = useState(false);
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

  const toggleNavbar = () => {
    setIsMinimized(!isMinimized);
  };

  if (loading) return <div>Loading...</div>;

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
            <Image
              src={userData?.profilePicUrl || profileMale.src}
              alt="profile"
              className="h-full w-full object-cover"
            />
          </div>
          <Account />
        </div>
      </span>
      <div className="w-full overflow-y-auto h-full flex">
        <nav
          className={`flex ${isMinimized ? "w-20" : "w-56"
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

        </nav>
        <div className="overflow-y-auto w-full">{children}</div>
      </div>
    </div>
  );
};

export default SideNavbar;