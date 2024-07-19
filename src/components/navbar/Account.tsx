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
      className="flex flex-col mt-2 dropdown-content menu bg-base-100 rounded-xl border border-zinc-300 z-[1] h-auto p-5  shadow-2xl w-[20rem] md:w-[22rem]"
    >
      <span className="w-full p-2">
        <h2 className="font-bold mb-2 text-zinc-700">
          Welcome, {memoizedUserData.name} 🎉
        </h2>

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
          label="Position"
          value={memoizedUserData?.position || ""}
          icon={MdWork}
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
        {!memoizedIsEmailVerified && (
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
        )}
        <span className="flex w-full justify-between">
          <button
            className="btn-sm btn rounded-md mt-3 btn-error text-white"
            onClick={handleSignOut}
          >
            sign out
          </button>
          {memoizedUserData.role == "user" && (
            <Link
              className="btn-sm btn rounded-md mt-3 btn-outline text-neutral"
              href={"/account"}
            >
              edit
            </Link>
          )}
        </span>
      </span>
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
