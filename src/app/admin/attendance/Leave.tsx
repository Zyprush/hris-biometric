"use client";
import { auth, db } from "@/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LeaveModal from "./LeaveModal";
import LeaveRequests from "./LeaveRequests";
import LeaveInfo from "./LeaveInfo";
import { useTheme } from "next-themes";

const Leave = () => {
  const { theme} = useTheme();
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("pending");
  const [curRequest, setCurRequest] = useState<object>({});

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;

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
    };

    fetchRequests();
  }, [user, showModal, status]);

  const openModal = (request: any) => {
    setShowModal(true);
    setCurRequest(request);
  };

  const openInfo = (request: any) => {
    setShowInfo(true);
    setCurRequest(request);
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full items-start gap-4 ">
        {showModal && (
          <LeaveModal setShowModal={setShowModal} curRequest={curRequest} />
        )}
        {showInfo && (
          <LeaveInfo setShowInfo={setShowInfo} curRequest={curRequest} />
        )}
        <div role="tablist" className="tabs tabs-lifted w-full">
          {["Pending", "Approved", "Rejected"].map((tabStatus) => (
            <React.Fragment key={tabStatus}>
              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className={`tab text-sm font-bold text-neutral dark:text-white ${status == tabStatus.toLowerCase() && "dark:text-neutral"} `}
                aria-label={tabStatus}
                defaultChecked={tabStatus === "Pending"}
                onClick={() => setStatus(tabStatus.toLowerCase())}
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 w-full rounded-box p-6 "
              >
                <LeaveRequests
                  requests={requests}
                  openModal={openModal}
                  openInfo={openInfo}
                  status={status}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leave;
