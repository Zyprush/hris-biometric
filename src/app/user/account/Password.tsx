"use client";
import React, { useState, ChangeEvent } from "react";
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { errorToast, successToast } from "@/components/toast";
import { IoMdEye } from "react-icons/io";
import { BsEyeSlashFill } from "react-icons/bs";
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
    <span className="fixed bg-zinc-800 p-20 bg-opacity-80 right-0 top-0 bottom-0 left-0 flex justify-center items-center gap-5">
      <span className="flex flex-col gap-5 bg-white rounded-2xl p-20 py-10">
        <button
          onClick={toggleShowPasswords}
          className="btn btn-neutral w-20 mx-auto text-2xl"
        >
          {showPasswords ?  <IoMdEye/> : <BsEyeSlashFill/>} 
        </button>
        <input
          type={showPasswords ? "text" : "password"}
          value={oldPassword}
          className="text-sm p-2 border rounded"
          onChange={handleOldPasswordChange}
          placeholder="Old password"
        />
        <input
          type={showPasswords ? "text" : "password"}
          value={newPassword}
          className="text-sm p-2 border rounded"
          onChange={handleNewPasswordChange}
          placeholder="New password"
        />
        <input
          type={showPasswords ? "text" : "password"}
          value={confirmPassword}
          className="text-sm p-2 border rounded"
          onChange={handleConfirmPasswordChange}
          placeholder="Re-enter password"
        />

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="btn btn-neutral w-20 mx-auto"
        >
          Submit
        </button>
      </span>
      <button
        className="fixed bottom-5 right-5 btn btn-neutral"
        onClick={() => setEdit(false)}
        disabled={loading}
      >
        Cancel
      </button>
    </span>
  );
};

export default Password;
