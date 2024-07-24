"use client";

import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { sendEmailVerification } from "firebase/auth";
import { warnToast } from "@/components/toast";
import { useUserStore } from "@/state/user";
import Link from "next/link";
import profileMale from "../../../public/img/profile-male.jpg";
import { IoMdSettings } from "react-icons/io";
import { IoCaretBackCircle } from "react-icons/io5";

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
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const router = useRouter();
  const { setUserData, setUser, userData } = useUserStore();
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
          setUser(user);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      className="flex flex-col mt-2 dropdown-content menu bg-base-100 rounded-2xl border border-zinc-300 z-50 h-auto shadow-2xl w-[13rem] p-0 absolute"
    >
      <span className="w-full h-auto border-b-2 gap-3 p-3 flex justify-start items-center">
        <div
          tabIndex={0}
          role="button"
          className="h-14 min-w-14 max-w-14 flex items-center justify-center overflow-hidden border-2 border-primary bg-primary rounded-full drop-shadow-md"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              userData?.profilePicUrl ||
              (userData?.role === "admin" ? "/img/profile-admin.jpg" : "/img/profile-male.jpg")
            }
            alt="profile"
            className="h-full w-full object-cover"
          />

        </div>
        <span className="w-auto">
          <h1 className="font-bold text-primary drop-shadow-md">
            Hello, {memoizedUserData?.nickname}!
          </h1>
        </span>
      </span>

      {memoizedUserData.role == "user" ? (
        <Link
          href="/user/account"
          className="flex gap-2 w-full border-b-2 p-3 hover:bg-primary text-primary font-semibold hover:text-white"
        >
          <IoMdSettings className="text-lg" /> Account
        </Link>
      ) : memoizedUserData.role == "admin" ? (
        <Link
          href="/admin/account"
          className="flex gap-2 w-full border-b-2 p-3 hover:bg-primary text-primary font-semibold hover:text-white"
        >
          <IoMdSettings className="text-lg" /> Account
        </Link>
      ) : null}

      <button
        className="flex gap-2 w-full border-b-2 p-3 font-semibold text-red-700 hover:bg-primary rounded-br-2xl rounded-bl-2xl hover:text-white"
        onClick={handleSignOut}
      >
        <IoCaretBackCircle className="text-lg" /> <h1>Sign Out</h1>
      </button>

      <span className="flex w-full justify-between"></span>
    </span>
  );
};

export default Account;
