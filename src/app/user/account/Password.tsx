"use client";
import React, { useState, ChangeEvent } from "react";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { errorToast, successToast } from "@/components/toast";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FirebaseError } from "firebase/app";

const Password = ({
  setEdit,
}: {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPasswords, setShowPasswords] = useState<boolean>(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 8) {
      errorToast("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      errorToast("New passwords do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      errorToast("New password must be different from the old password.");
      return;
    }

    setLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);

      try {
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        successToast("Password updated successfully.");
        console.log("Password updated successfully.");
        setEdit(false);
      } catch (error: any) {
        console.log("error", error);
        if (error instanceof FirebaseError) {
          const errorMessages: { [key: string]: string } = {
            "auth/invalid-credential": "Please enter the correct old password!",
            "auth/user-disabled": "This account has been disabled. Please contact support.",
            "auth/too-many-requests": "Too many failed login attempts. Please try again later."
          };
          errorToast(errorMessages[error.code as string] || "An unexpected error occurred. Please try again.");
        } else {
          errorToast("An unexpected error occurred. Please try again.");
        }
      }
    } else {
      errorToast("No user is currently signed in.");
    }

    setLoading(false);
  };

  const handleOldPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const toggleShowPasswords = () => {
    setShowPasswords((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              value={oldPassword}
              onChange={handleOldPasswordChange}
              placeholder="Old password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder="New password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <input
              type={showPasswords ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={toggleShowPasswords}
            className="text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {showPasswords ? (
              <span className="flex items-center">
                <IoMdEyeOff className="mr-1" /> Hide Passwords
              </span>
            ) : (
              <span className="flex items-center">
                <IoMdEye className="mr-1" /> Show Passwords
              </span>
            )}
          </button>
          
        </div>
          <button
            onClick={handleChangePassword}
            disabled={loading}
            className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary hover:text-black focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        
        <button
          className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onClick={() => setEdit(false)}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Password;