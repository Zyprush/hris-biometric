"use client";

import AdminRouteGuard from "@/app/AdminRouteGuard/page";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { useState } from "react";
import { BsPersonBoundingBox, BsPersonCircle } from "react-icons/bs";
import Payroll from "./Payroll";
import Deduction from "./Deduction";

const AdminPayroll = () => {
  const [currentTab, setCurrentTab] = useState("Payroll");

  const renderContent = () => {
    switch (currentTab) {
      case "Payroll":
        return <Payroll />;
      case "Deduction":
        return <Deduction />;
      default:
        return <Payroll />;
    }
  };

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="container h-full mx-auto p-4">
            <div className="grid grid-col-1 py-4">
              <p className="text-lg font-bold">{currentTab}</p>
              <div className="join rounded-md my-5">
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTab === "Payroll" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTab("Payroll")}
                >
                  <BsPersonBoundingBox className="text-base" /> Payroll
                </button>
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTab === "Deduction" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTab("Deduction")}
                >
                  <BsPersonCircle className="text-base" /> Deduction
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

export default AdminPayroll;
