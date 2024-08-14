"use client";
import { useLeaveStore } from "@/state/leave";
import React, { useEffect } from "react";
interface Props {
  userData: any;
}

const LeaveTaken = ({ userData }: Props) => {
  const { monthLeave, yearLeave, fetchUserLeaveThisMonth, fetchUserLeaveThisYear} = useLeaveStore();
  useEffect(() => {
    if (userData) {
        fetchUserLeaveThisMonth(userData.id)
        fetchUserLeaveThisYear(userData.id)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);
  return (
    <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-neutral dark:text-white">
        Leave Taken
      </h2>
      <div className="stats flex dark:bg-gray-800">
        <div className="stat">
          {/* <div className="stat-title">{new Date().toLocaleString('default', { month: 'long' })}</div> */}
          <div className="stat-value text-primary  dark:text-white">{monthLeave ? monthLeave: "N/A"}</div>
          <div className="stat-desc dark:text-zinc-300">Leave this month</div>
        </div>

        <div className="stat">
          {/* <div className="stat-title">{new Date().getFullYear()}</div> */}
          <div className="stat-value text-primary dark:text-white">{yearLeave ? yearLeave: "N/A"}</div>
          <div className="stat-desc dark:text-zinc-300">Leave this year</div>
        </div>
      </div>
    </div>
  );
};

export default LeaveTaken;
