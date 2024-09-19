"use client";

import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { useState } from "react";
import Attendance from "./AttendanceNew";
import Leave from "./Leave";
import Logs from "./Logs";
import { FaFileCircleQuestion, FaClipboardUser } from "react-icons/fa6";

const AdminAttendance = () => {
  const [currentTab, setCurrentTab] = useState("Leave");

  const renderContent = () => {
    switch (currentTab) {
      case "Attendance":
        return <Attendance />;
      case "Leave":
        return <Leave />;
      case "Logs":
        return <Logs />;
      default:
        return <Attendance />;
    }
  };

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="container h-full mx-auto p-4">
            <div className="grid grid-col-1 py-4">
              <p className="text-lg font-bold dark:text-white">{currentTab}</p>
              <div className="join rounded-md my-4">
                <button
                  className={`btn btn-md md:btn-md join-item border border-primary ${
                    currentTab === "Leave"
                      ? "bg-primary text-white border-primary hover:bg-secondary hover:text-white hover:border-primary"
                      : "hover:bg-secondary hover:text-white hover:border-primary bg-white "
                  }`}
                  onClick={() => setCurrentTab("Leave")}
                >
                  <FaFileCircleQuestion className="text-base" /> Leave Request
                </button>
                <button
                  className={`btn btn-md md:btn-md join-item border border-primary ${
                    currentTab === "Attendance"
                      ? "bg-primary text-white border-primary hover:bg-secondary hover:text-white hover:border-primary"
                      : "hover:bg-secondary hover:text-white hover:border-primary bg-white "
                  }`}
                  onClick={() => setCurrentTab("Attendance")}
                >
                  <FaClipboardUser className="text-base" /> Attendance
                </button>
              </div>
              {renderContent()}
            </div>
          </div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default AdminAttendance;
