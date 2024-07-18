"use client";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { errorToast, successToast } from "@/components/toast";
import { auth, db } from "@/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useUserStore } from "@/state/user";

const RequestForm = ({ setShowRequestForm, requests}: { setShowRequestForm: React.Dispatch<React.SetStateAction<boolean>>, requests: object}) => {
  const [user] = useAuthState(auth);
  const [leaveDate, setLeaveDate] = useState<string>("");
  const [totalDays, setTotalDays] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { userData, fetchUserData} = useUserStore();


  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user, fetchUserData]);

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
      reason,
      creationDate: currentDate,
      userId: user?.uid,
      status: "pending",
      remarks: "",
      department: userData?.department,
      submittedBy: userData?.name,
    };
    try {
      const submittedDoc = await addDoc(collection(db, "requests"), requestData);
      successToast("Request created successfully");
      setLeaveDate(""); // Clear input fields after successful submission
      setTotalDays("");
      setReason("");
      setShowRequestForm(false)
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

          <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-zinc-800 bg-opacity-50 py-6 flex p-4 flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[#135D66] to-[#77B0AA] shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl"></div>
              <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-5 sm:py-10 md:w-[24rem]">
                <div className="max-w-md mx-auto">
                  <div>
                    <h1 className="text-lg font-semibold">Request Leave</h1>
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
                            className="p-2 mb-2 border text-sm rounded text-zinc-500 w-40"
                          />
                        </div>
                        <textarea
                          value={reason}
                          placeholder="Reason"
                          onChange={(e) => setReason(e.target.value)}
                          className="w-full p-2 text-sm mb-2 border rounded"
                          rows={5}
                          style={{ resize: "none" }}
                        />
                      </div>
                      <div className="relative">
                        <button
                          onClick={createRequest}
                          disabled={loading}
                          className={`bg-blue-600 text-xs hover:bg-secondary text-white font-semibold px-4 py-2 rounded-md ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          {loading ? "Creating..." : "Submit Leave"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  );
};

export default RequestForm;