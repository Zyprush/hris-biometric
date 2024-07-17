"use client";
import UserRouteGuard from "@/app/UserRouteGuard/page";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import { auth, db } from "@/firebase";
import { collection, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaCommentAlt, FaQuestion } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import { format } from "date-fns";
import Link from "next/link";
import { errorToast, warnToast } from "@/components/toast";
import Loading from "@/components/bioLoading";

const Request = () => {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleMarkRead = async (request: any) => {
    setLoading(true)
    console.log('request', request)
    try {
      const docRef = doc(db, "requests", request.id);
      const updateData = {
        ...request,
        seen: true,
      };
      await updateDoc(docRef, updateData);

      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== request.id)
      );
    } catch (error) {
      console.log('error', error)
      errorToast(`Error marking request as read: ${error}`);
    }
    setLoading(false)
  };

  useEffect(() => {
    const fetchRequests = async () => {
      if (user) {
        try {
          const querySnapshot = await getDocs(
            query(
              collection(db, "requests"),
              where("userId", "==", user.uid),
              where("seen", "==", false),
              limit(20)
            )
          );
          const userRequests = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setRequests(userRequests);
        } catch (error) {
          errorToast(`Error fetching requests: ${error}`);
        }
      }
    };
  
    fetchRequests();
  }, [user]);
  

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div className="container flex flex-col justify-start items-center md:p-10 p-4 mx-auto">
            <ToastContainer />
            {loading && <span className="fixed top-2"><Loading/></span>}
            

            <div className="flex flex-col rounded-md bg-white p-3 w-full md:max-w-[25rem]">
              {requests?.length == 0 && (
                <span className=" mx-auto text-xs font-semibold text-zinc-700 p-2 border rounded-lg flex gap-2 items-center">
                  <FaCommentAlt /> No Unread leave request!
                </span>
              )}
              {requests?.map((request) => (
                <button
                  className="p-4 border-2 rounded-lg mb-4 flex justify-start text-left bg-base tooltip tooltip-top"
                  key={request?.id}
                  disabled={loading}
                  onClick={() => handleMarkRead(request)}
                  data-tip="Click to mark as read!"
                >
                  <div className="flex gap-2 items-start justify-start w-full flex-col">
                    <div className="text-zinc-700 mb-2 flex gap-2 items-center w-full">
                      <span className="bg-zinc-700 rounded text-sm font-semibold p-2 py-1 text-white">
                        {request?.leaveDate && format(new Date(request?.leaveDate), "MMM dd yyyy")}
                      </span>
                      <p
                        className="font-normal text-sm text-zinc-500 tooltip tooltip-right"
                        data-tip="Total days of Leave"
                      >
                        {request?.totalDays} days
                      </p>
                    </div>
                    <div className="text-sm text-zinc-500 leading-5 ml-1">
                      {request?.reason}
                    </div>
                    {request?.remarks && (
                      <div className="text-sm text-zinc-500 leading-5 ml-1 mt-2 items-start flex flex-col">
                        <span className="font-semibold text-zinc-700 flex items-center">
                          Rejected <FaQuestion className="text-sm" />
                        </span>
                        {request?.remarks}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <Link
              href={"/user/request"}
              className="fixed bottom-4 right-4 p-4 btn btn-neutral text-xs rounded"
            >
              Back
            </Link>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default Request;
