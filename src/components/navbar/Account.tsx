"use client";

import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { warnToast } from "@/components/toast";
import { FaIdBadge, FaBuildingUser } from "react-icons/fa6";
import { MdEmail, MdWork } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { useUserStore } from "@/state/user";
import Link from "next/link";
import profileMale from "../../../public/img/profile-male.jpg";
import { IoChevronBackCircleOutline, IoSettingsOutline } from "react-icons/io5";

interface UserData {
  name: string;
  nickname: string;
  email: string;
  employeeId: string;
  role: string;
  phone: string;
  department: string;
  position: string;
  sss: string;
  startDate: string;
  philHealthNumber: string;
  tinNumber: string;
  profilePicUrl: string;
}

const Account = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const router = useRouter();
  const { setUserData: setUser } = useUserStore();
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
          setUser(userDocSnap.data() as UserData);
          if (!user.emailVerified) {
            setIsEmailVerified(false);
            warnToast(
              "Your email is not verified. Please check your inbox for a verification email."
            );
          }
        }
      }
    };
    fetchUserData();
  }, [user, setUser]);

  const handleSignOut = async () => {
    await auth.signOut();
    router.push("/sign-in");
  };

  const handleResendVerification = async () => {
    if (user && !user.emailVerified) {
      setIsResendingVerification(true);
      try {
        await sendEmailVerification(user);
        warnToast("Verification email sent. Please check your inbox.");
      } catch (error) {
        console.error("Error sending verification email:", error);
        warnToast("Failed to send verification email. Please try again later.");
      } finally {
        setIsResendingVerification(false);
      }
    }
  };

  const memoizedUserData = useMemo(() => userData, [userData]);
  const memoizedIsEmailVerified = useMemo(
    () => isEmailVerified,
    [isEmailVerified]
  );
  const memoizedIsResendingVerification = useMemo(
    () => isResendingVerification,
    [isResendingVerification]
  );

  if (!memoizedUserData || loading) {
    return null;
  }

  return (
    <span
      tabIndex={0}
      className="flex flex-col mt-2 dropdown-content menu bg-base-100 rounded-bl-2xl rounded-br-2xl border border-zinc-300 z-[1] h-auto  shadow-2xl w-[16rem] p-0"
    >
      <span className="w-full border-b-2 gap-4 p-3 flex justify-items-start items-center">
        <div
          tabIndex={0}
          role="button"
          className="h-14 w-14 flex items-center justify-center overflow-hidden border-2 border-primary bg-primary rounded-full"
        >
          <img
            src={userData?.profilePicUrl || profileMale.src}
            alt="profile"
            className="h-full w-full object-cover"
          />
        </div>
        <h1>Hello, {memoizedUserData?.name}!</h1>
        <span className="flex flex-col gap-2"></span>
      </span>
      {/**
      <span className="w-full border-b-2 p-3">
        <UserInfo
          label="Email"
          value={memoizedUserData?.email || ""}
          icon={MdEmail}
        />
        <UserInfo
          label="Department"
          value={memoizedUserData?.department || ""}
          icon={FaBuildingUser}
        />
        <UserInfo
          label="Employee ID"
          value={memoizedUserData?.employeeId || ""}
          icon={FaIdBadge}
        />
        <UserInfo
          label="Verified"
          value={memoizedIsEmailVerified ? "Yes" : "No"}
          icon={RiVerifiedBadgeFill}
        />
      </span>
       */}
      {/*
      {!memoizedIsEmailVerified && (
        <span className="w-full border-b-2 p-3 hover:bg-primary hover:text-white">
          <button
            onClick={handleResendVerification}
            disabled={memoizedIsResendingVerification}
            className={`mt-4 px-4 py-2 flex bg-blue-600 border-blue-600 text-white btn-sm btn rounded-md mr-2 hover:bg-blue-800 ${
              memoizedIsResendingVerification
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {memoizedIsResendingVerification
              ? "Sending..."
              : "Resend Verification Email"}
          </button>
        </span>
      )}
       */}
      {memoizedUserData.role == "user" ? (
        <Link
          href="/user/account"
          className="flex gap-2 w-full border-b-2 p-3 hover:bg-primary hover:text-white"
        >
          <IoSettingsOutline className="text-lg" /> Account
        </Link>
      ) : memoizedUserData.role == "admin" ? (
        <Link
          href="/admin/account"
          className="flex gap-2 w-full border-b-2 p-3 hover:bg-primary hover:text-white"
        >
          <IoSettingsOutline className="text-lg" /> Account
        </Link>
      ) : null}

      <button
        className="flex gap-2 w-full border-b-2 p-3 hover:bg-primary rounded-br-2xl rounded-bl-2xl hover:text-white"
        onClick={handleSignOut}
      >
        <IoChevronBackCircleOutline className="text-lg text-red-700" /> <h1 className="text-red-700">Sign Out</h1>
      </button>

      <span className="flex w-full justify-between"></span>
    </span>
  );
};

interface UserInfoProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}
const UserInfo = ({ label, value, icon: Icon }: UserInfoProps) => {
  return (
    <>
      {value ? (
        <span className="text-gray-600 text-xs flex gap-2 items-center truncate">
          <Icon className="" /> <p className="font-semibold">{label}:</p>
          <p className="truncate">{value}</p>
        </span>
      ) : null}
    </>
  );
};
export default Account;
