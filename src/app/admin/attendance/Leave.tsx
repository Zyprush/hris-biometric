"use client";
import { auth, db } from "@/firebase";
import { format } from "date-fns";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsPersonCircle } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import LeaveModal from "./LeaveModal";
import { FaQuestion } from "react-icons/fa";

const Leave = () => {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("pending");
  // const [loading, setLoading] = useState<boolean>(false);
  const [curRequest, setCurRequest] = useState<object>({});
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
  }, [user, showModal, status]);

  const openModal = (request: any) => {
    setShowModal(true);
    setCurRequest(request)
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col gap-4">
        {showModal && <LeaveModal setShowModal={setShowModal} curRequest={curRequest}/>}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex gap-2 mx-auto text-xs rounded-md mr-auto ml-0 p-2 font-bold border-2 btn-outline text-zinc-700"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <div className="flex flex-wrap rounded-md gap-4">
          {requests.map((request) => (
            <div
              className="p-4 border-2 rounded-lg mb-4 flex justify-between bg-base w-[20rem]  md:w-[25rem]"
              key={request.id}
            >
                <div className="flex flex-col gap-2 items-start justify-start">
                  <div className="text-zinc-700 mb-2 flex gap-2 items-center w-full">
                    <span
                      className="bg-zinc-700 rounded text-sm font-semibold p-2 py-1 text-white"
                    >
                      {format(new Date(request.leaveDate), "MMM dd yyyy")}{" "}
                    </span>
                    <p
                      className="font-normal text-sm text-zinc-500"
                    >
                      {request.totalDays} days
                    </p>
                    <span className="flex gap-2">
                    <span className="flex gap-2 text-xs p-1 px-2 border rounded-lg" ><BsPersonCircle className="text-lg"/>{request?.submittedBy}</span>
                  </span>
                    <button
                      className="mr-2 m-auto"
                      onClick={() => openModal(request)}
                    >
                      <SlOptions />
                    </button>
                  </div>
  
                  <div className="text-sm text-zinc-500 leading-5 ml-1">
                    {request.reason}
                  </div>
                {request.remarks && (<div className="text-sm text-zinc-500 leading-5 ml-1 items-start flex flex-col">
                  <span className="font-semibold text-zinc-700 flex items-center">Rejected  <FaQuestion className="text-sm"/> </span> {request?.remarks}
                </div>)}
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leave;