"use client";

import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import { warnToast } from "@/components/toast";
import { FaIdBadge, FaPhone, FaBuildingUser } from "react-icons/fa6";
import { MdEmail, MdWork } from "react-icons/md";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { format } from "date-fns/format";
import { RiVerifiedBadgeFill } from "react-icons/ri";

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

  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const setAuthChecked = (isChecked: boolean) => {
    console.log("Auth checked:", isChecked);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
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
  }, [user]);

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

  if (!userData || loading) {
    return null;
  }

  return (
    <span
      tabIndex={0}
      className="flex flex-col mt-2 dropdown-content menu bg-base-100 rounded-xl border border-zinc-300 z-[1] h-auto p-5  shadow-2xl w-[20rem] md:w-[23rem]"
    >
      <ToastContainer />
      <span className="w-full p-2">
        <h2 className="font-bold mb-2 text-zinc-700">Welcome, {userData.name} 🎉</h2>

        <UserInfo label="Email" value={userData?.email || ""} icon={MdEmail} />
        <UserInfo
          label="Department"
          value={userData?.department || ""}
          icon={FaBuildingUser}
        />
        <UserInfo
          label="Position"
          value={userData?.position || ""}
          icon={MdWork}
        />
        <UserInfo
          label="Employee ID"
          value={userData?.employeeId || ""}
          icon={FaIdBadge}
        />
        <UserInfo label="Phone" value={userData?.phone || ""} icon={FaPhone} />
        <UserInfo label="SSS" value={userData?.sss || ""} icon={FaIdBadge} />
        <UserInfo
          label="Philhealth"
          value={userData?.philHealthNumber || ""}
          icon={FaIdBadge}
        />
        <UserInfo
          label="TIN"
          value={userData?.tinNumber || ""}
          icon={FaIdBadge}
        />

        <UserInfo
          label="Start Date"
          value={
            userData?.startDate
              ? format(new Date(userData.startDate), "MMM dd, yyyy")
              : ""
          }
          icon={BsFillCalendar2DateFill}
        />
        <UserInfo
          label="Verified"
          value={isEmailVerified ? "Yes" : "No"}
          icon={RiVerifiedBadgeFill}
        />
        {!isEmailVerified && (
          <button
            onClick={handleResendVerification}
            disabled={isResendingVerification}
            className={`mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
              isResendingVerification ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isResendingVerification
              ? "Sending..."
              : "Resend Verification Email"}
          </button>
        )}
        <button
          className="btn-sm btn rounded-md mt-3 btn-error text-white"
          onClick={handleSignOut}
        >
          sign out
        </button>
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
        <p className="text-gray-600 text-xs flex gap-2 items-center">
          <Icon className="" /> <p className="font-semibold">{label}:</p>{" "}
          {value}
        </p>
      ) : null}
    </>
  );
};
export default Account;