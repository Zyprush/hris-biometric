"use client";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { ToastContainer } from "react-toastify";
import { errorToast } from "@/components/toast";
import { auth, db } from "@/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import UserRouteGuard from "@/app/UserRouteGuard/page";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";

const Request = () => {
  const [user] = useAuthState(auth);
  const [leaveDate, setLeaveDate] = useState<string>("");
  const [totalDays, setTotalDays] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const createRequest = async (): Promise<void> => {
    setLoading(true);
    if (!leaveDate || !reason || !totalDays) {
      errorToast("Complete all input!");
      setLoading(false);
      return;
    }
    const currentDate = new Date().toISOString();
    if (new Date(leaveDate) < new Date()) {
      errorToast("Leave date must be an upcoming date!");
      setLoading(false);
      return;
    }
    const existingRequest = await getExistingRequest(user?.uid);
    if (existingRequest) {
      errorToast("You have already submitted a request for this Date!");
      setLoading(false);
      return;
    }
    const requestData = {
      leaveDate,
      totalDays,
      creationDate: currentDate,
      userId: user?.uid,
      status: "pending",
      remarks: "",
      reason,
    };
    try {
      await addDoc(collection(db, "requests"), requestData);
    } catch (error) {
      errorToast(`Error creating Request:${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getExistingRequest = async (
    userId: string | undefined
  ): Promise<any> => {
    const querySnapshot = await getDocs(
      query(
        collection(db, "requests"),
        where("userId", "==", userId),
        where("leaveDate", "==", leaveDate)
      )
    );
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      return null;
    }
  };

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div className="min-h-screen bg-gray-100 py-6 flex p-4 flex-col justify-center sm:py-12">
            <ToastContainer />
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl"></div>
              <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-5 sm:py-10 md:w-[24rem]">
                <div className="max-w-md mx-auto">
                  <div>
                    <h1 className="text-2xl font-semibold">Request Leave</h1>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:leading-7">
                      <div className="relative">
                        <div className="flex gap-2 w-full">
                          <input
                            type="date"
                            value={leaveDate}
                            onChange={(e) => setLeaveDate(e.target.value)}
                            required
                            className="p-2 mb-2 border text-sm rounded text-zinc-500 w-48"
                          />
                          <input
                            type="number"
                            value={totalDays}
                            onChange={(e) => setTotalDays(e.target.value)}
                            placeholder="Number of Days"
                            required
                            className="p-2 mb-2 border rounded text-zinc-500 w-40"
                          />
                        </div>
                        <textarea
                          value={reason}
                          placeholder="Reason"
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full p-2 mb-2 border rounded"
                          rows={5}
                          style={{ resize: "none" }}
                        />
                      </div>
                      <div className="relative">
                        <button
                          onClick={createRequest}
                          disabled={loading}
                          className={`bg-blue-600 hover:bg-secondary text-white font-semibold px-4 py-2 rounded-md ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading ? "Creating..." : "Submit"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default Request;
