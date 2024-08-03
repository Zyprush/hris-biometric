"use client";
import React, { Dispatch, SetStateAction } from "react";
import animationData from "../../public/img/read-animation.json";
import Lottie from "react-lottie";
import Link from "next/link";
import { IoIosCloseCircle } from "react-icons/io";

// Define the shape of the props
interface NotificationsProps {
  setShowNotif: Dispatch<SetStateAction<boolean>>;
  text: string;
}

const UserNotifications: React.FC<NotificationsProps> = ({
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
    // <div className="fixed max-w-[22rem] min-h-10 right-4 bottom-10 top-auto left-auto inset-0 z-50 flex gap-4">
    //   <span className="bg-white border relative flex flex-row gap-10 rounded-xl p-4 h-auto text-zinc-600 mb-10 mr-4 m-auto shadow-xl  max-w-[22rem]  min-w-[22rem] custom-shadow2">
    //     <Link className="flex gap-2" href={"/user/request/updated"}>
    //       <span className="flex">
    //         <Lottie options={defaultOptions} height={50} width={50} />
    //       </span>
    //       <p className="text-sm my-auto">
    //         {text}
    //       </p>
    //     </Link>
    //     <button
    //       onClick={() => setShowNotif(false)}
    //       className="absolute -top-2 -right-2"
    //     >
    //       <IoIosCloseCircle className="text-2xl" />
    //     </button>
    //   </span>
    // </div>
            <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
              <div className="card-body">
                <span className="font-bold text-lg">8 New Notifications</span>
                <span className="text-info">Dummy notification content</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">View all</button>
                </div>
              </div>
            </div>
  );
};

export default UserNotifications;
