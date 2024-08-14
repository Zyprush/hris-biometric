"use client";
import React, { useState, ChangeEvent } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { errorToast, successToast } from "@/components/toast";
import animationData from "../../../../../public/img/password-animation.json";
import Lottie from "react-lottie";

const AdminChangePassword = ({
  setChange,
  email,
}: {
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handlePasswordReset = async () => {
    if (!email) {
      errorToast("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      successToast("Password reset email sent successfully.");
      console.log("Password reset email sent successfully.");
      // const currentDate = new Date().toISOString();
      // addHistory({
      //   adminId: userData?.id,
      //   text: `${userData?.name} created ${name} account`,
      //   time: currentDate,
      //   type: "admin"
      // });
      setChange(false);
    } catch (error: any) {
      console.log("Error:", error);
      errorToast("Error sending password reset email. Please try again.");
    }

    setLoading(false);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <span className="fixed inset-0 z-50 flex flex-col bg-zinc-800 bg-opacity-80 right-0 top-0 bottom-0 left-0 justify-center items-center gap-5 ">
      <span className="flex gap-5 flex-col bg-white rounded-2xl p-10">
        <span className="flex">
          <Lottie options={defaultOptions} height={200} width={200} />
        </span>
        <span className="flex justify-between mx-auto gap-10">
          <button
            onClick={handlePasswordReset}
            disabled={loading}
            className="btn btn-neutral w-auto mx-auto"
          >
            Send Password reset email
          </button>
          <button
            className="btn btn-neutral"
            onClick={() => setChange(false)}
            disabled={loading}
          >
            Cancel
          </button>
        </span>
      </span>
    </span>
  );
};

export default AdminChangePassword;
