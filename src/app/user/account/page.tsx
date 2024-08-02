/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { SignedIn } from "@/components/signed-in";
import React, { useEffect, useState } from "react";
import { MdEmail, MdModeEdit } from "react-icons/md";
import {
  FaBuilding,
  FaFlag,
  FaIdBadge,
  FaIdCardClip,
  FaUserTag,
} from "react-icons/fa6";
import { RiUserSmileFill, RiVerifiedBadgeFill } from "react-icons/ri";
import { warnToast } from "@/components/toast";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { sendEmailVerification } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import Password from "@/app/user/account/Password";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import UserLayout from "@/components/UserLayout";
import { format } from "date-fns";

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
  gender: string;
  nationality: string;
  status: string;
  supervisor: string;
  birthday: string;
  id: string;
}
const UserAccount = () => {
  const [user, loading] = useAuthState(auth);
  const [edit, setEdit] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
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
  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
            <ToastContainer />
            <div className="max-w-full px-4 sm:px-6 sm:py-6 lg:py-8 my-8">
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-primary"></div>
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-black opacity-30"></div>
                  <img
                    src={userData?.profilePicUrl || "/img/profile-admin.jpg"}
                    alt={userData?.name}
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 object-cover w-32 h-32 rounded-full border-4 border-primary shadow-lg"
                  />
                </div>
                <div className="pt-16 pb-8 px-4 text-center">
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">{userData?.name || "Admin User"}</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{userData?.position || "Administrator"}</p>
                  {!isEmailVerified && (
                    <div className="mt-4">
                      <button
                        onClick={handleResendVerification}
                        disabled={isResendingVerification}
                        className="px-4 py-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-black rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-300 ease-in-out"
                      >
                        {isResendingVerification ? "Sending..." : "Resend Verification Email"}
                      </button>
                    </div>
                  )}
                  {!edit && (
                    <button
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary dark:hover:bg-primary transition duration-300 ease-in-out flex items-center justify-center mx-auto"
                      onClick={() => setEdit(true)}
                    >
                      <MdModeEdit className="mr-2" /> Change Password
                    </button>
                  )}
                  {edit && <Password setEdit={setEdit} />}
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 px-4 py-8">
                  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <UserInfo label="Email" value={userData?.email} icon={MdEmail} />
                    <UserInfo label="Department" value={userData?.department} icon={FaBuilding} />
                    <UserInfo label="Employee ID" value={userData?.employeeId} icon={FaIdCardClip} />
                    <UserInfo label="Phone" value={userData?.phone} icon={FaIdBadge} />
                    <UserInfo label="Birthday" value={userData?.birthday ? format(userData?.birthday, 'MMM dd, yyyy'):""} icon={FaIdBadge} />
                    <UserInfo label="Verified" value={isEmailVerified ? "Yes" : "No"} icon={RiVerifiedBadgeFill} />
                    <UserInfo label="Gender" value={userData?.gender} icon={RiUserSmileFill} />
                    <UserInfo label="Nationality" value={userData?.nationality} icon={FaFlag} />
                    <UserInfo label="Status" value={userData?.status} icon={FaUserTag} />
                    <UserInfo label="Supervisor" value={userData?.supervisor} icon={FaUserTag} />
                    <UserInfo label="PhilHealth" value={userData?.philHealthNumber} icon={FaUserTag} />
                    <UserInfo label="TIN" value={userData?.tinNumber} icon={FaUserTag} />
                    <UserInfo label="SSS" value={userData?.sss} icon={FaUserTag} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};
interface UserInfoProps {
  label: string;
  value: any;
  icon: React.ComponentType<{ className?: string }>;
}
const UserInfo = ({ label, value, icon: Icon }: UserInfoProps) => {
  return (
    value ? 
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition duration-300 ease-in-out">
      <div className="flex items-center">
        <Icon className="text-2xl text-primary dark:text-white mr-3" />
        <div className="truncate">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-base font-semibold text-gray-800 dark:text-gray-200">{value}</p>
        </div>
      </div>
    </div> : null
  );
};
export default UserAccount;
