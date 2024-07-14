"use client";
import UserRouteGuard from "@/app/UserRouteGuard/page";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import { auth, db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaCalendarCheck } from "react-icons/fa";
import { MdWorkHistory } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";
import { successToast } from "@/components/toast";
import Link from "next/link";

const Request = () => {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (user) {
        const querySnapshot = await getDocs(
          query(
            collection(db, "requests"),
            where("userId", "==", user.uid),
            where("status", "==", "pending"),
            limit(20)
          )
        );
        const userRequests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setRequests(userRequests);
      }
    };

    fetchRequests();
  }, [user]);

  const deleteRequest = async (requestId: string) => {
    try {
      const postRef = doc(db, "requests", requestId);
      await deleteDoc(postRef);
      successToast("Request deleted!");
      // Update the state to remove the deleted request
      setRequests(requests.filter((request) => request.id !== requestId)); // Remove the deleted request from the state
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div className="container flex flex-col justify-start items-center md:p-10 p-4 w-screen mx-auto">
            <ToastContainer/>
            <div className="border p-3 w-full md:max-w-[25rem]">
              <span className="flex gap-1 mx-auto md:ml-0 md:mr-auto font-bold mb-5">
                <MdWorkHistory className="text-xl" /> Pending Leave Requests
              </span>
              {requests.map((request) => (
                <div className="alert shadow-lg mb-4 flex justify-between" key={request.id}>
                  <span className="flex gap-2">
                    <FaCalendarCheck className="text-3xl my-auto" />
                    <div>
                      <h3 className="font-bold text-zinc-700 text-sm flex gap-2 items-center">
                        {format(new Date(request.leaveDate), "MMM dd, yyyy")} <p className="font-normal text-xs text-zinc-500">{request.totalDays} days</p>
                      </h3>
                      <div className="text-xs">{request.reason}</div>
                    </div>
                  </span>
                  <button onClick={() => deleteRequest(request.id)} className="btn btn-sm btn-error rounded-md text-white text-xs">
                    delete
                  </button>
                </div>
              ))}
            </div>
            <Link href="/user/request/request-form" className="fixed bottom-4 right-4 p-4 btn btn-neutral text-xs rounded">Submit Leave</Link>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default Request;