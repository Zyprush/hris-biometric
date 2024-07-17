"use client";

import AdminRouteGuard from "@/components/AdminRouteGuard";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { useState } from "react";
import { BsPersonBoundingBox, BsPersonCircle } from "react-icons/bs";
import { MdViewTimeline } from "react-icons/md";
import Attendance from "./Attendance";
import Leave from "./Leave";
import Logs from "./Logs";

const AdminAttendance = () => {
  const [currentTab, setCurrentTab] = useState("Leave");

  const renderContent = () => {
    switch (currentTab) {
      case "Leave":
        return <Leave />;
      case "Attendance":
        return <Attendance />;
      case "Logs":
        return <Logs />;
      default:
        return <Leave />;
    }
  };

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="container h-full mx-auto p-4">
            <div className="grid grid-col-1">
              <div className="join rounded-md mb-4">
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTab === "Leave" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTab("Leave")}
                >
                  <BsPersonBoundingBox className="text-base" /> Leave Request
                </button>
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTab === "Attendance" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTab("Attendance")}
                >
                  <BsPersonCircle className="text-base" /> Attendance
                </button>
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTab === "Logs" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTab("Logs")}
                >
                  <MdViewTimeline className="text-base" /> View Logs
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
