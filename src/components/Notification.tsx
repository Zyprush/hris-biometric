"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import animationData from "../../public/img/read-animation.json";
import Lottie from "react-lottie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { db, auth } from "@/firebase";
import { getDocs, query, collection, where } from "firebase/firestore";

// Define the shape of the props
interface NotificationsProps {
  userData: any;
  user: any;
}

const Notification: React.FC<NotificationsProps> = ({ userData, user }) => {
  const router = useRouter();
  const [notRead, setNotRead] = useState<number>(0);
  const [newRequest, setNewRequest] = useState<number>(0);

  const fetchNotRead = async () => {
    if (user) {
      const queryNotRead = await getDocs(
        query(
          collection(db, "requests"),
          where("userId", "==", user.uid),
          where("seen", "==", false)
        )
      );
      setNotRead(queryNotRead.docs.length);
    }
  };

  const fetchNewRequest = async () => {
    if (user) {
      const queryNewRequest = await getDocs(
        query(collection(db, "requests"), where("status", "==", "pending"))
      );
      setNewRequest(queryNewRequest.docs.length);
      console.log("newRequest", queryNewRequest.docs.length);
    }
  };

  useEffect(() => {
    if (userData?.role === "admin") {
      fetchNewRequest();
    } else {
      fetchNotRead();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);



  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div
      tabIndex={0}
      className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow-2xl border"
    >
      <div className="card-body">
        <span className="font-bold text-lg">8 New Notifications</span>
        <span className="text-info">Dummy notification content</span>{" "}
        <span className="flex">
          <Lottie options={defaultOptions} height={50} width={50} />
        </span>
        <div className="card-actions">
          <button className="btn btn-primary btn-block">View all</button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
// {showNotif && memoizedUserData?.role === "user" && (
//   <UserNotifications
//     setShowNotif={setShowNotif}
//     text={`You have ${notRead} new updates for your leave request. Click here.`}
//   />
// )}
// {showNotif && memoizedUserData?.role === "admin" && (
//   <AdminNotifications
//     setShowNotif={setShowNotif}
//     text={`You have ${newRequest} new pending leave requests. Click here.`}
//   />
// )}