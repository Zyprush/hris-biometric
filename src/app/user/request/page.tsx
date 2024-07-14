"use client"
import UserRouteGuard from "@/app/UserRouteGuard/page";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import { errorToast, successToast } from "@/components/toast";
import { auth, db } from "@/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { MdWorkHistory } from "react-icons/md";
import { ToastContainer } from "react-toastify";

const Request = () => {
  const [user] = useAuthState(auth);
  const [leaveDate, setLeaveDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const createRequest = async (): Promise<void> => {
    setLoading(true);
    if (!leaveDate || !reason) {
      errorToast("Complete all input!")
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
      creationDate: currentDate,
      userId: user?.uid,
      status: "pending",
      remarks: "",
      reason
    };
    try {
      await addDoc(collection(db, "requests"), requestData); 
      successToast("Request successfully written!");
    } catch (error) {
      errorToast(`Error creating Request:${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getExistingRequest = async (userId: string | undefined): Promise<any> => {
    const querySnapshot = await getDocs(query(collection(db, "requests"), where("userId", "==", userId), where("leaveDate", "==", leaveDate)));
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
          <div className="container flex flex-col justify-start items-center md:p-10 p-4 max-w-80 mx-auto">
            <ToastContainer/>
            <span className="flex gap-1 mx-auto md:ml-0 md:mr-auto font-bold mb-5">
              <MdWorkHistory className="text-xl" /> Leave Request Form
            </span>
            <input
              type="date"
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              placeholder="Date of Leave"
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              value={reason}
              placeholder="Reason"
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <button 
              onClick={createRequest} 
              disabled={loading}
              className={`bg-neutral hover:bg-secondary text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default Request;