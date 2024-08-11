"use client";
import React, { Dispatch, SetStateAction } from "react";
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

  return (
    <div className="fixed max-w-[22rem] min-h-10 right-4 bottom-10 top-auto left-auto inset-0 flex gap-4">
      <span className="bg-white border relative flex flex-row gap-10 rounded-lg p-4 h-auto text-zinc-600 mb-10 mr-4 m-auto shadow-xl  max-w-[22rem]  min-w-[22rem] custom-shadow2 z-50">
        <Link className="flex gap-2" href={"/admin/attendance"}>
          <span className="flex">
          </span>
          <p className="text-sm my-auto">
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
