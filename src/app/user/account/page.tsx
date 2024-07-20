/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import React, { useEffect, useState } from "react";
import { MdEmail, MdModeEdit } from "react-icons/md";
import { IoMdSave } from "react-icons/io";
import { FaBuildingUser, FaIdBadge } from "react-icons/fa6";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { warnToast } from "@/components/toast";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { sendEmailVerification } from "firebase/auth";
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
const UserAccount = () => {
  const [user, loading] = useAuthState(auth);
  const [editedData, setEditedData] = useState<UserData>();
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
          setEditedData(userDocSnap.data() as UserData);
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
          <div className="w-full h-full flex justify-center ">
            <span className="flex md:flex-row gap-5 flex-col p-4">
              <span>
                <div className="relative w-36 h-36 mx-auto mb-4">
                  <img
                    src={editedData?.profilePicUrl || "/img/profile-admin.jpg"}
                    alt={editedData?.name}
                    className="border-2  drop-shadow-sm rounded-full object-cover w-full h-full border border-primary"
                  />
                </div>
              </span>
              <span className="grid gap-4 md:mt-5 md:gap-x-8 md:grid-cols-2 content-start">
                <UserInfo
                  label="Name"
                  value={editedData?.name || ""}
                  icon={FaIdBadge}
                />
                <UserInfo
                  label="Email"
                  value={editedData?.email || ""}
                  icon={MdEmail}
                />
                <UserInfo
                  label="Department"
                  value={editedData?.department || ""}
                  icon={FaBuildingUser}
                />
                <UserInfo
                  label="Employee ID"
                  value={editedData?.employeeId || ""}
                  icon={FaIdBadge}
                />
                <UserInfo
                  label="Verified"
                  value={isEmailVerified ? "Yes" : "No"}
                  icon={RiVerifiedBadgeFill}
                />
              </span>
            </span>

            {!isEmailVerified && (
              <span className="w-full border-b-2 p-3 hover:bg-primary hover:text-white">
                <button
                  onClick={handleResendVerification}
                  disabled={isResendingVerification}
                  className={`mt-4 px-4 py-2 flex bg-blue-600 border-blue-600 text-white btn-sm btn rounded-md mr-2 hover:bg-blue-800 ${
                    isResendingVerification
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isResendingVerification
                    ? "Sending..."
                    : "Resend Verification Email"}
                </button>
              </span>
            )}

            <span className="fixed bottom-5 right-4 md:right-10 flex gap-5">
              {edit && (
                <button
                  className="btn btn-success pr-6"
                  onClick={() => setEdit(false)}
                >
                  <IoMdSave /> save
                </button>
              )}
              {!edit && (
                <button
                  className="btn btn-primary pr-6"
                  onClick={() => setEdit(true)}
                >
                  <MdModeEdit /> edit
                </button>
              )}
              {edit && (
                <button
                  className="btn btn-neutral"
                  onClick={() => setEdit(false)}
                >
                  cancel
                </button>
              )}
            </span>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
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
        <div className="text-gray-600 text-sm flex flex-col justify-start truncate">
          <div className="flex gap-2 items-center">
            <Icon className="" />
            <p className="font-semibold text-xs">{label}:</p>
          </div>
          <p className="truncate">{value}</p>
        </div>
      ) : null}
    </>
  );
};
export default UserAccount;
