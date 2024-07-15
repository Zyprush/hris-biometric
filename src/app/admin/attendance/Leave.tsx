"use client";
import { auth, db } from "@/firebase";
import { format } from "date-fns";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsCalendar2Date } from "react-icons/bs";
import {
  FaCalendarCheck,
} from "react-icons/fa";
import { MdViewTimeline } from "react-icons/md";

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
                  <h3 className="text-zinc-700 text-base mb-2 font-bold flex gap-2 items-center">
                    {format(new Date(request.leaveDate), "MMM dd, yyyy")}   
                    <p className="font-normal text-sm text-zinc-500">
                      {request.totalDays} days
                    </p>
                  </h3>
                  <div className="text-sm font-semibold text-zinc-600">{request.reason}</div>
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
