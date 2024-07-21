"use client";
import { auth, db } from "@/firebase";
import { format } from "date-fns";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsPersonCircle } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import LeaveModal from "./LeaveModal";
import { FaCommentAlt, FaQuestion } from "react-icons/fa";
import LeaveRequests from "./LeaveRequests";

const Leave = () => {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("pending");
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
    setCurRequest(request);
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full gap-4">
        {showModal && (
          <LeaveModal setShowModal={setShowModal} curRequest={curRequest} />
        )}
        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab text-sm font-bold text-neutral"
            aria-label="Pending"
            value={status}
            onClick={(e) => setStatus("pending")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <LeaveRequests
              requests={requests}
              openModal={openModal}
              status={status}
            />
          </div>
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab text-sm font-bold text-neutral"
            aria-label="Approved"
            defaultChecked
            onClick={(e) => setStatus("approved")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <LeaveRequests
              requests={requests}
              openModal={openModal}
              status={status}
            />
          </div>

          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab text-sm font-bold text-neutral"
            aria-label="Rejected"
            onClick={(e) => setStatus("rejected")}
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <LeaveRequests
              requests={requests}
              openModal={openModal}
              status={status}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leave;
