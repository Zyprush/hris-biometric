"use client";

import AdminRouteGuard from "@/app/AdminRouteGuard/page";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { useState } from "react";
import { BsPersonBoundingBox, BsPersonCircle } from "react-icons/bs";
import { MdViewTimeline } from "react-icons/md";
import Attendance from "./Attendance";
import Leave from "./Leave";
import Logs from "./Logs";

const AdminAttendance = () => {
  const [status, setStatus] = useState<string>("leave");

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="flex flex-col w-full h-full justify-start items-start p-3">
            <div className="flex gap-4">
              <button
                onClick={() => setStatus("leave")}
                className={`flex items-center gap-2 mx-auto text-xs rounded-md md:ml-0 md:mr-auto text-white p-2 font-semibold border-2 mb-5 ${
                  status === "leave"
                    ? "bg-zinc-800 border-zinc-800"
                    : "btn-outline text-zinc-700"
                }`}
              >
                <BsPersonBoundingBox className="text-base" /> Leave
              </button>
              <button
                onClick={() => setStatus("attendance")}
                className={`flex items-center gap-2 mx-auto text-xs rounded-md md:ml-0 md:mr-auto text-white p-2 font-semibold border-2 mb-5 ${
                  status === "attendance"
                    ? "bg-zinc-800 border-zinc-800"
                    : "btn-outline text-zinc-700"
                }`}
              >
                <BsPersonCircle className="text-base" /> Attendance
              </button>
              <button
                onClick={() => setStatus("logs")}
                className={`flex items-center gap-2 mx-auto text-xs rounded-md md:ml-0 md:mr-auto text-white p-2 font-semibold border-2 mb-5 ${
                  status === "logs"
                    ? "bg-zinc-800 border-zinc-800"
                    : "btn-outline text-zinc-700"
                }`}
              >
                <MdViewTimeline className="text-base" /> Logs
              </button>
            </div>
            <div className="flex">
              {status === "leave" && <Leave />}
              {status === "attendance" && <Attendance />}
              {status === "logs" && <Logs />}
            </div>
          </div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default AdminAttendance;
