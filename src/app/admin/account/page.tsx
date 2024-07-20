/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { SignedIn } from "@/components/signed-in";
import React, { useEffect, useState } from "react";
import { MdEmail, MdModeEdit } from "react-icons/md";
import {
  FaAddressCard,
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
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import AdminLayout from "@/components/AdminLayout";
import Password from "@/app/user/account/Password";
import { FaUserAlt, FaUserEdit } from "react-icons/fa";

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
}
const AdminAccount = () => {
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
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="w-full h-full flex flex-col items-center justify-start p-6">
            <ToastContainer />
            <div className="w-full md:w-auto flex flex-col items-center">
              <div className="relative w-36 h-36 mb-4">
                <img
                  src={userData?.profilePicUrl || "/img/profile-admin.jpg"}
                  alt={userData?.name}
                  className="border-2 drop-shadow-sm mx-auto rounded-full object-cover w-full h-full border-primary"
                />
              </div>
              {!isEmailVerified && (
                <div className="w-full md:w-auto border-b-2 p-3 mt-6 md:mt-0">
                  <button
                    onClick={handleResendVerification}
                    disabled={isResendingVerification}
                    className={`mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-800 ${
                      isResendingVerification
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isResendingVerification
                      ? "Sending..."
                      : "Resend Verification Email"}
                  </button>
                </div>
              )}
              {!edit && (
                <button
                  className="btn btn-neutral mb-4"
                  onClick={() => setEdit(true)}
                >
                  <MdModeEdit className="" /> Change Password
                </button>
              )}
              {edit && <Password setEdit={setEdit} />}
              <div className="grid gap-6 md:grid-cols-2 content-start w-full p-5 rounded-lg shadow-sm border mb-5">
                <UserInfo
                  label="Name"
                  value={userData?.name || "N/A"}
                  icon={FaUserAlt}
                />
                <UserInfo
                  label="Email"
                  value={userData?.email || "N/A"}
                  icon={MdEmail}
                />
                <UserInfo
                  label="Department"
                  value={userData?.department || "N/A"}
                  icon={FaBuilding}
                />
                <UserInfo
                  label="Employee ID"
                  value={userData?.employeeId || "N/A"}
                  icon={FaIdCardClip}
                />
                <UserInfo
                  label="SSS"
                  value={userData?.sss || "N/A"}
                  icon={FaAddressCard}
                />
                <UserInfo
                  label="Phone"
                  value={userData?.phone || "N/A"}
                  icon={FaIdBadge}
                />
                <UserInfo
                  label="TIN"
                  value={userData?.tinNumber || "N/A"}
                  icon={FaAddressCard}
                />
                <UserInfo
                  label="Verified"
                  value={isEmailVerified ? "Yes" : "No"}
                  icon={RiVerifiedBadgeFill}
                />
                <UserInfo
                  label="Gender"
                  value={userData?.gender || "Unknown"}
                  icon={RiUserSmileFill}
                />
                <UserInfo
                  label="Nationality"
                  value={userData?.nationality || "Unknown"}
                  icon={FaFlag}
                />
                <UserInfo
                  label="Status"
                  value={userData?.status || "Unknown"}
                  icon={FaUserTag}
                />
                <UserInfo
                  label="Supervisor"
                  value={userData?.status || "Unknown"}
                  icon={FaUserEdit}
                />
              </div>
            </div>
          </div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
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
        <div className="text-gray-600 text-sm flex gap-2 justify-start truncate">
          <Icon className="bg-zinc-700 rounded-md p-2 text-[2rem] text-white" />
          <div className="flex flex-col justify-center items-start">
            <p className="font-bold text-sm">{label}</p>
            <p className="truncate text-xs text-zinc-500">{value}</p>
          </div>
        </div>
      ) : null}
    </>
  );
};
export default AdminAccount;
