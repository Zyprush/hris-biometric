"use client";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import { auth, db } from "@/firebase";
import { collection, doc, getDocs, limit, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaCommentAlt, FaQuestion } from "react-icons/fa";
import { format } from "date-fns";
import Link from "next/link";
import { errorToast } from "@/components/toast";
import { UserRouteGuard } from "@/components/UserRouteGuard";

const Request = () => {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any[]>([]);


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

          // Mark all fetched requests as seen
          userRequests.forEach(async (request) => {
            const docRef = doc(db, "requests", request.id);
            try {
              await updateDoc(docRef, { seen: true });
            } catch (error) {
              console.log('error', error);
              errorToast(`Error marking request as seen: ${error}`);
            }
          });
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
            
            <div className="flex flex-col p-3 w-full md:max-w-[25rem]">
              {requests?.length == 0 && (
                <span className="mx-auto text-xs font-semibold text-zinc-700 p-2 border rounded-lg flex gap-2 items-center">
                  <FaCommentAlt /> No Unread leave request!
                </span>
              )}
              {requests?.map((request) => (
                <span
                  className="p-4 border-2 rounded-lg mb-4 flex justify-start text-left bg-white"
                  key={request?.id}
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
                </span>
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
