"use client";
import UserRouteGuard from "@/app/UserRouteGuard/page";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import { auth, db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaCalendarTimes, FaCheckCircle, FaQuestion } from "react-icons/fa";
import { MdViewTimeline } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { successToast } from "@/components/toast";
import RequestForm from "@/app/user/request/RequestForm";

const Request = () => {
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
            where("userId", "==", user.uid),
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

  const deleteRequest = async (requestId: string) => {
    try {
      setLoading(true); // Set loading to true when starting deletion
      const postRef = doc(db, "requests", requestId);
      const docSnap = await getDoc(postRef);
      if (docSnap.exists() && docSnap.data().status === "pending") {
        await deleteDoc(postRef);
        successToast("Request deleted!");
        setRequests(requests.filter((request) => request.id !== requestId));
      } else {
        console.error("Request not found or not in pending status.");
      }
    } catch (error) {
      console.error("Error deleting request:", error);
    } finally {
      setLoading(false); // Set loading back to false after deletion attempt
    }
  };

  const toggleRequestForm = () => {
    setShowRequestForm(!showRequestForm);
  };

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div className="container flex flex-col justify-start items-center md:p-10 p-4 mx-auto">
            <ToastContainer />
            {showRequestForm && (
              <RequestForm setShowRequestForm={setShowRequestForm} />
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setStatus("pending")}
                className={`flex items-center gap-2 mx-auto text-xs rounded-md md:ml-0 md:mr-auto text-white p-2 font-bold border-2 mb-5 ${
                  status === "pending"
                    ? "bg-zinc-800 border-zinc-800"
                    : "btn-outline text-zinc-700"
                }`}
              >
                <MdViewTimeline className="text-base" /> Pending
              </button>
              <button
                onClick={() => setStatus("approved")}
                className={`flex items-center gap-2 mx-auto text-xs rounded-md md:ml-0 md:mr-auto text-white p-2 font-bold border-2 mb-5 ${
                  status === "approved"
                    ? "bg-zinc-800 border-zinc-800"
                    : "btn-outline text-zinc-700"
                }`}
              >
                <FaCheckCircle className="text-base" /> Approved
              </button>
              <button
                onClick={() => setStatus("rejected")}
                className={`flex items-center gap-2 mx-auto text-xs rounded-md md:ml-0 md:mr-auto text-white p-2 font-bold border-2 mb-5 ${
                  status === "rejected"
                    ? "bg-zinc-800 border-zinc-800"
                    : "btn-outline text-zinc-700"
                }`}
              >
                <FaCalendarTimes className="text-base" /> Rejected
              </button>
            </div>

            {/* PENDING */}
            <div className="flex flex-col rounded-md bg-white p-3 w-full md:max-w-[25rem]">
              {requests.map((request) => (
                <div
                  className="p-4 border-2 rounded-lg mb-4 flex justify-between bg-base"
                  key={request.id}
                >
                  <span className="flex gap-2 items-start justify-start">
                    <div>
                      <div className="text-zinc-700 mb-2 flex gap-2 items-center">
                        <span
                          className="bg-zinc-700 rounded text-sm font-semibold p-2 py-1 text-white tooltip tooltip-right"
                          data-tip="Date of leave"
                        >
                          {format(new Date(request.leaveDate), "MMM dd yyyy")}{" "}
                        </span>
                        <p
                          className="font-normal text-sm text-zinc-500 tooltip tooltip-right"
                          data-tip="Total days of Leave"
                        >
                          {request.totalDays} days
                        </p>

                        {status === "pending" && (
                          <button
                            onClick={() => deleteRequest(request.id)}
                            disabled={loading}
                            className="btn mr-2 m-auto btn-sm btn-error rounded-md text-white text-xs"
                          >
                            {loading ? "Deleting..." : "Delete"}
                          </button>
                        )}
                      </div>
                      <div className="text-sm text-zinc-500 leading-5 ml-1">
                        {request.reason}
                      </div>
                      {request.remarks && (
                        <div className="text-sm text-zinc-500 leading-5 ml-1 mt-2 items-start flex flex-col">
                          <span className="font-semibold text-zinc-700 flex items-center">
                            Rejected <FaQuestion className="text-sm" />
                          </span>
                          {request?.remarks}
                        </div>
                      )}
                    </div>
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={toggleRequestForm}
              className="fixed bottom-4 right-4 p-4 btn btn-neutral text-xs rounded"
            >
              {showRequestForm ? "Close" : "Submit"}
            </button>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default Request;
