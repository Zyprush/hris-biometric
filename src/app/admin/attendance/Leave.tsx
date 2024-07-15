"use client";
import { auth, db } from "@/firebase";
import { format } from "date-fns";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsCalendar2Date } from "react-icons/bs";
import { FaCalendarCheck } from "react-icons/fa";
import { MdViewTimeline } from "react-icons/md";
import { SlOptions } from "react-icons/sl";

const Leave = () => {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any[]>([]);
  const [showRequestForm, setShowRequestForm] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchRequests = async () => {
      if (user) {
        const querySnapshot = await getDocs(
          query(
            collection(db, "requests"),
            where("status", "==", status),
            limit(20)
          )
        );
        const userRequests = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(userRequests);
      }
    };

    fetchRequests();
  }, [user, showRequestForm, status]);

  const toggleRequestForm = () => {
    setShowRequestForm(!showRequestForm);
  };
  return (
    <div className="flex w-full">
      <div className="flex flex-col gap-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex items-center gap-2 mx-auto text-xs rounded-md md:ml-0 md:mr-auto p-2 font-bold border-2 btn-outline text-zinc-700"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex flex-col rounded-md bg-white p-3 w-full md:max-w-[25rem]">
          {requests.map((request) => (
            <div
              className="p-4 border-2 rounded-lg mb-4 flex justify-between bg-base"
              key={request.id}
            >
              <span className="flex gap-2 items-start justify-start">
                <div>
                  <div className="text-zinc-700 mb-2 flex gap-2 items-center">
                    <span className="bg-zinc-700 rounded text-sm font-semibold p-2 py-1 text-white tooltip tooltip-right" data-tip="Date of leave">
                      {format(new Date(request.leaveDate), "MMM dd yyyy")}{" "}
                    </span>
                    <p className="font-normal text-sm text-zinc-500 tooltip tooltip-right" data-tip="Total days of Leave">
                      {request.totalDays} days
                    </p>
                    <button  className="mr-2 m-auto" >
                      <SlOptions/>
                    </button>
                  </div>
                  <div className="text-sm text-zinc-500 leading-5 ml-1">
                    {request.reason}
                  </div>
                </div>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leave;
