"use client";
import React, { Dispatch, SetStateAction } from "react";
import { FaMessage } from "react-icons/fa6";
import animationData from "../../public/img/read-animation.json";
import Lottie from "react-lottie";
import Link from "next/link";
import { IoIosCloseCircle } from "react-icons/io";

// Define the shape of the props
interface NotificationsProps {
  setShowNotif: Dispatch<SetStateAction<boolean>>;
  text: string;
}

const AdminNotifications: React.FC<NotificationsProps> = ({
  setShowNotif,
  text,
}) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="fixed border border-red-400 inset-0 py-6 flex flex-col justify-center sm:py-12 gap-4 z-50">
      <span className="bg-white border relative flex flex-row gap-10 rounded-xl p-4 h-auto text-zinc-600 mb-10 mr-4 m-auto shadow-xl max-w-[22rem] custom-shadow2">
        <Link className="flex gap-2" href={"/admin/attendance"}>
          <span className="flex">
            <Lottie options={defaultOptions} height={50} width={50} />
          </span>
          <p className="text-xs my-auto">
            {text}
          </p>
        </Link>
        <button
          onClick={() => setShowNotif(false)}
          className="absolute -top-2 -right-2"
        >
          <IoIosCloseCircle className="text-2xl" />
        </button>
      </span>
    </div>
  );
};

export default AdminNotifications;
