"use client";
import React, { Dispatch, SetStateAction } from "react";
import { FaMessage } from "react-icons/fa6";
import animationData from "../../public/img/read-animation.json";
import Lottie from "react-lottie";
import Link from "next/link";

// Define the shape of the props
interface NotificationsProps {
  setShowNotif: Dispatch<SetStateAction<boolean>>;
  notRead: number;
}

const Notifications: React.FC<NotificationsProps> = ({
  setShowNotif,
  notRead,
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
    <div className="fixed inset-0 w-full h-full bg-zinc-800 bg-opacity-50 py-6 flex flex-col justify-center sm:py-12 gap-4 z-50">
      <div className="bg-white shadow flex flex-col gap-10 rounded-lg mx-auto p-10 text-zinc-600  max-w-[23rem]">
        <Lottie
          options={defaultOptions}
          height={100}
          width={100}
        />
        <Link className="flex gap-2 text-sm p-2 border rounded-md cursor-pointer border-zinc-400 justify-center items-center" href={"/user/request/updated"}>
          <FaMessage className="text-md" />
          {notRead} leave Request update
        </Link>
        <button
          onClick={() => setShowNotif(false)}
          className="p-4 btn btn-neutral text-xs rounded w-20 mx-auto"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Notifications;
