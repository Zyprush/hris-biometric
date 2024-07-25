import React from "react";
import { FaCommentAlt, FaQuestion } from "react-icons/fa";
import { BsPersonCircle } from "react-icons/bs";
import { SlOptions } from "react-icons/sl";
import { format } from "date-fns";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";

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
  openInfo: (request: Request) => void;
}

const LeaveRequests: React.FC<LeaveRequestsProps> = ({
  requests,
  status,
  openModal,
  openInfo,
}) => {
  return (
    <AdminRouteGuard>
      <div className="flex w-full rounded-md gap-4">
        {requests.length === 0 ? (
          <span className="text-xs font-semibold text-zinc-700 p-2 border rounded-lg flex gap-2 items-center">
            <FaCommentAlt /> No {status} leave request!
          </span>
        ) : (
          <div className="overflow-x-auto flex w-full">
            <table className="mb-5 mx-auto text-sm rounded-lg border min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-sm text-gray-700 font-semibold">
                  <th className="px-6 py-3 text-left">Leave Date</th>
                  <th className="px-6 py-3 text-left">Employee</th>
                  <th className="px-6 py-3 text-left">Department</th>
                  <th className="px-6 py-3 text-left">Date Submitted</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-sm text-zinc-600">
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
                    {status === "pending" ? (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="btn-sm btn btn-primary"
                          onClick={() => openModal(request)}
                        >
                          respond
                        </button>
                      </td>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="btn-sm btn btn-primary"
                          onClick={() => openInfo(request)}
                        >
                          view
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminRouteGuard>
  );
};

export default LeaveRequests;
