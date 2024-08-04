"use client";
import React, { useEffect, useState } from "react";
import animationData from "../../public/img/read-animation.json";
import Lottie from "react-lottie";
import Link from "next/link";
import { db } from "@/firebase";
import { getDocs, query, collection, where } from "firebase/firestore";
import { UserDatainterface } from "@/state/interface";

// Define the shape of the props
interface NotificationsProps {
  userData: UserDatainterface;
  user: any;
  setShowNotif: any;
}

const Notification: React.FC<NotificationsProps> = ({
  userData,
  user,
  setShowNotif,
}) => {
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

    console.log("newRequest", newRequest);
    console.log("notRead", notRead);
    if (notRead >= 1 || newRequest >= 1) {
      setShowNotif(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRequest, notRead, setShowNotif, userData]);

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
        <span className="flex">
          <Lottie options={defaultOptions} height={60} width={60} />
        </span>
        <span className="font-semibold text-primary mx-auto text-center">
          {userData?.role == "admin"
            ? `${newRequest} new leave request.`
            : `${notRead} new leave request update.`}
        </span>
        {userData?.role == "admin" ? (
          <div className="card-actions">
            <Link  href={"/admin/attendance"} className="btn btn-primary rounded-full btn-block">
              View all
            </Link>
          </div>
        ) : (
          <div className="card-actions">
            <Link href={"/user/request/updated"} className="btn btn-primary rounded-full btn-block">
              View all
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification;