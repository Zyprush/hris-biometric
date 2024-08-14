"use client";
import React, { useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import { BsCalendar2DayFill, BsFillSendFill } from "react-icons/bs";
import { MdDiscount } from "react-icons/md";
import { FaClipboardQuestion } from "react-icons/fa6";
import { format } from "date-fns";
import { GoIssueClosed } from "react-icons/go";
import { RiCloseCircleLine } from "react-icons/ri";
import { errorToast, successToast } from "@/components/toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { ToastContainer } from "react-toastify";
import { useHistoryStore } from "@/state/history";
import { useUserStore } from "@/state/user";

const LeaveModal = ({
  setShowModal,
  curRequest,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  curRequest: any;
}) => {
  const [reason, setReason] = useState<string>("");
  const [respond, setRespond] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { addHistory } = useHistoryStore();
  const { userData } = useUserStore();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "requests", curRequest.id);
      const updateData = {
        ...curRequest,
        seen: false,
      };
      if (respond === "rejected") {
        if (!reason) {
          errorToast("Please provide a reason for rejecting");
        } else {
          updateData.status = "rejected";
          updateData.remarks = reason;
          const currentDate = new Date().toISOString();
          await updateDoc(docRef, updateData);
          await addHistory({
            userId: curRequest.userId,
            adminId: userData?.id,
            text: `${userData?.name} rejected ${curRequest.submittedBy} leave request`,
            time: currentDate,
            type: "leave"
          });
          successToast("Request Rejected!");
          setShowModal(false);
        }
      } else {
        updateData.status = "approved";
        await updateDoc(docRef, updateData);
        const currentDate = new Date().toISOString();
        await addHistory({
          userId: curRequest.userId,
          adminId: userData?.id,
          text: `${userData?.name} approved ${curRequest.submittedBy} leave request`,
          time: currentDate,
          type: "leave"
        });
        successToast("Request Approved!");
        setShowModal(false);
      }
    } catch (error) {
      errorToast(`Error updating Request: ${error}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-zinc-800 bg-opacity-50 py-6 flex p-4 flex-col justify-center sm:py-12 gap-4 z-50">
      <ToastContainer />
      <div className="w-full md:w-[24rem] gap-1 shadow-lg bg-white h-auto mx-auto border rounded-lg p-3 text-sm">
        <Info
          label={"Submitted by"}
          value={curRequest?.submittedBy}
          icon={IoPersonCircle}
        />
        <Info
          label={"Date of Leave"}
          value={format(new Date(curRequest?.leaveDate), "MMM dd, yyyy")}
          icon={BsCalendar2DayFill}
        />
        <Info
          label={"How many day"}
          value={curRequest?.totalDays}
          icon={MdDiscount}
        />
        <p className="flex mt-2 flex-col text-gray-600 gap-1 items-start justify-start">
          <p className="font-semibold flex gap-1 items-center mr-auto ml-0">
            <FaClipboardQuestion className="" />
            Reason
          </p>
          <span className="text-sm ml-1">{curRequest?.reason}</span>
        </p>
        <span className="flex justify-start mt-2 gap-4">
          <button
            onClick={() => setRespond("approved")}
            className={`flex items-center gap-2 text-xs rounded-md text-white p-2 font-semibold border-2 ${
              respond === "approved"
                ? "bg-zinc-800 border-zinc-800"
                : "btn-outline text-zinc-700"
            }`}
          >
            <GoIssueClosed className="text-base" /> Approve
          </button>
          <button
            onClick={() => setRespond("rejected")}
            className={`flex items-center gap-2 text-xs rounded-md text-white p-2 font-semibold border-2 ${
              respond === "rejected"
                ? "bg-zinc-800 border-zinc-800"
                : "btn-outline text-zinc-700"
            }`}
          >
            <RiCloseCircleLine className="text-base" /> Reject
          </button>
          {respond && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex items-center gap-2 text-xs ml-auto mr-0 rounded-md ${
                loading
                  ? "bg-gray-400 border-gray-400 text-gray-600"
                  : "bg-success border-success text-white"
              } p-2 font-semibold border-2`}
            >
              <BsFillSendFill className="text-base" />{" "}
              {loading ? "loading..." : "Submit"}
            </button>
          )}
        </span>
        {respond == "rejected" && (
          <textarea
            rows={3}
            placeholder="Why did you reject this leave request?"
            className="border-2 p-2 rounded w-full text-xs dark:bg-zinc-100 border-zinc-400 mt-2 resize-none"
            onChange={(e) => setReason(e.target.value)}
          />
        )}
      </div>
      <button
        onClick={() => setShowModal(false)}
        className="p-4 btn btn-neutral text-xs rounded w-20 mx-auto"
      >
        Cancel
      </button>
    </div>
  );
};

interface UserInfoProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}
const Info = ({ label, value, icon: Icon }: UserInfoProps) => (
  <span className="text-gray-600 flex gap-1 items-center font-semibold">
    <Icon className="text-neutral" /> <p className="font-bold text-neutral">{label}:</p> {value}
  </span>
);

export default LeaveModal;
