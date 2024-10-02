"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/firebase";
import { getDocs, query, collection, where } from "firebase/firestore";
import { UserDatainterface } from "@/state/interface";

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
    }
  };

  useEffect(() => {
    if (userData?.role === "admin") {
      fetchNewRequest();
    } else {
      fetchNotRead();
    }

    if (notRead >= 1 || newRequest >= 1) {
      setShowNotif(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRequest, notRead, setShowNotif, userData]);
  return (
    <ul
      tabIndex={0}
      className="mt-3 z-50 dropdown-content w-60 bg-gray-900 text-white p-4 rounded-lg shadow-2xl border"
    >
      <h2 className="text-xl font-bold flex mb-4">Notifications</h2>{" "}
      {/* Title */}
      <div className="flex items-start mb-3">
        <div className="bg-red-500 rounded-full p-2 mr-3"></div>
        <div>
          <p className="text-sm">
            {userData?.role == "admin" &&
              newRequest > 0 &&
              `Total of ${newRequest} new leave request has been submitted. This request is awaiting review and approval.`}
            {userData?.role == "user" &&
              notRead > 0 &&
              `There is an update regarding about the leave request that you submitted.`}
              {newRequest < 1 && notRead <1 && "No notifications to show."}
          </p>
          {/* <p className="text-xs text-gray-400">Friday 2:20 pm</p> */}
        </div>
      </div>
      <Link
        href={
          userData?.role == "admin"
            ? "/admin/attendance"
            : "/user/request/updated"
        }
        className="mt-8 py-2 px-4 text-sm underline text-white"
      >
        View all
      </Link>{" "}
      {/* View all notifications button */}
    </ul>
  );
};

export default Notification;
