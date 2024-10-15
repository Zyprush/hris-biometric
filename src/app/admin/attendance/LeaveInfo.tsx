"use client";
import React from "react";
import { format } from "date-fns";

const LeaveInfo = ({
  setShowInfo,
  curRequest,
}: {
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  curRequest: any;
}) => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 w-full h-full bg-zinc-800 bg-opacity-50 py-6 flex p-4 flex-col justify-center sm:py-12 gap-4 z-50">
      <div className="w-full md:w-[24rem] flex flex-col gap-2 shadow-lg bg-white h-auto mx-auto text-sm p-5 rounded-lg mb-4 justify-between bg-base">
        <div className="flex gap-2 items-start justify-start w-full flex-col">
          <div className="text-zinc-700 mb-2 flex gap-2 items-center w-full">
            <span className="bg-zinc-700 rounded text-sm font-semibold p-2 py-1 text-white">
              {format(new Date(curRequest?.leaveDate), "MMM dd yyyy")}
            </span>
            <span
              className="font-normal text-sm text-zinc-500 tooltip tooltip-right"
              data-tip="Total days of Leave"
            >
              {curRequest?.totalDays} days
            </span>
          </div>
          <div className=" text-zinc-500 leading-5 ml-1 mt-2 items-start flex flex-col">
            <p>
              {`${curRequest?.submittedBy} a member of our team in ${curRequest?.department} department is requesting a leave for total of ${curRequest?.totalDays} day, starting from ${format(new Date(curRequest?.leaveDate), "MMM dd yyyy")}`}
            </p>
          </div>
          {curRequest?.reason && (
            <div className="text-sm text-zinc-500 leading-5 ml-1 mt-2 items-start flex flex-col">
              <span className="font-bold text-neutral flex items-center">
                Reason of Leave
              </span>
              {curRequest?.reason}
            </div>
          )}
          {curRequest?.remarks && (
            <div className="text-sm text-zinc-500 leading-5 ml-1 mt-2 items-start flex flex-col">
              <span className="font-bold text-neutral flex items-center">
                Reason for Decline
              </span>
              <p className="">{curRequest?.remarks}</p>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => setShowInfo(false)}
        className="p-4 btn btn-neutral text-xs rounded w-20 mx-auto"
      >
        Close
      </button>
    </div>
  );
};

export default LeaveInfo;
