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
    <div className="fixed inset-0 w-full h-full bg-zinc-800 bg-opacity-40 py-6 flex flex-col justify-center sm:py-12 gap-4 z-50">
      <div className="bg-white shadow flex flex-col gap-10 rounded-xl pt-28 mx-auto p-8 text-zinc-600  max-w-[23rem]">
        <span className="flex -mt-32">
          <Lottie options={defaultOptions} height={200} width={200} />
        </span>
        <p className="text-sm text-center border shadow-sm rounded-md p-4 -mt-20 z-50 bg-white">
         {text}
        </p>
        <span className="flex justify-between">
          <Link
            className="flex p-4 btn btn-neutral text-xs rounded w-auto mx-auto"
            href={"/admin/attendance"}
          >
            <FaMessage className="text-sm" />
            view
          </Link>
          <button
            onClick={() => setShowNotif(false)}
            className="flex p-4 btn btn-neutral text-xs rounded w-auto mx-auto"
          >
            <IoIosCloseCircle className="text-sm" /> close
          </button>
        </span>
      </div>
    </div>
  );
};

export default AdminNotifications;
