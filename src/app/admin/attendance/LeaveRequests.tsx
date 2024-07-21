import React from "react";
import { FaCommentAlt, FaQuestion } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { format } from "date-fns";

interface Request {
  id: string;
  leaveDate: string;
  totalDays: number;
  submittedBy: string;
  reason: string;
  remarks?: string;
  creationDate: string;
  department: string;
}

interface LeaveRequestsProps {
  requests: Request[];
  status: string;
  openModal: (request: Request) => void;
}

const LeaveRequests: React.FC<LeaveRequestsProps> = ({
  requests,
  status,
  openModal,
}) => {
  return (
    <div className="flex flex-wrap rounded-md gap-4">
      {requests.length === 0 && (
        <span className="text-xs font-semibold text-zinc-700 p-2 border rounded-lg flex gap-2 items-center">
          <FaCommentAlt /> No {status} leave request!
        </span>
      )}
      <div className="overflow-x-auto">
        <table className="mb-5 mx-auto text-sm rounded-lg border max-w-[72rem] min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-sm text-gray-700 font-semibold">
              <th className="px-6 py-3 text-left">Leave Date</th>
              <th className="px-6 py-3 text-left">Employee</th>
              <th className="px-6 py-3 text-left">Department</th>
              <th className="px-6 py-3 text-left">Date Submitted</th>
              {status === "pending" && (
                <th className="px-6 py-3 text-left">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 flex flex-col whitespace-nowrap font-semibold text-sm text-zinc-600">
                  {format(new Date(request?.leaveDate), "MMM dd yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request?.submittedBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {request?.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(request?.creationDate), "MMM dd yyyy")}
                </td>
                {status === "pending" && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="mr-2 m-auto"
                      onClick={() => openModal(request)}
                    >
                      <SlOptions />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* {requests.map((request) => (
        <div
          className="p-4 border-2 rounded-lg mb-4 flex justify-between bg-base w-[20rem] md:w-[25rem]"
          key={request.id}
        >
          <div className="flex flex-col gap-2 items-start justify-start">
            <div className="text-zinc-700 mb-2 flex gap-2 items-center w-full">
              <span className="bg-neutral rounded text-sm font-semibold p-3 py-1 text-white">
                {format(new Date(request.leaveDate), "MMM dd yyyy")}
              </span>
              <p className="font-normal text-sm text-zinc-500"></p>
              <span className="flex gap-2">
                <span className="flex gap-2 text-xs p-1 px-2 border rounded-lg">
                  <BsPersonCircle className="text-lg" />
                </span>
              </span>
            </div>
            <div className="text-sm text-zinc-500 font-thin leading-5 ml-1">
              {request.reason}
            </div>
            {request.remarks && (
              <div className="text-sm font-thin text-zinc-500 leading-5 ml-1 items-start flex flex-col">
                <span className="font-semibold text-zinc-700 flex items-center">
                  Rejected <FaQuestion className="text-sm" />
                </span>
                {request.remarks}
              </div>
            )}
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default LeaveRequests;
