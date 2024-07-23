"use client";

import {AdminRouteGuard} from "@/components/AdminRouteGuard";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { useState } from "react";
import { BsCashStack, BsFileMinus } from "react-icons/bs";
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
                  className={`btn btn-md md:btn-md join-item border border-primary ${
                    currentTab === "Payroll"
                      ? "bg-primary text-white border-primary hover:bg-secondary hover:text-white hover:border-primary"
                      : "hover:bg-secondary hover:text-white hover:border-primary bg-white "
                  }`}
                  onClick={() => setCurrentTab("Payroll")}
                >
                  <BsCashStack className="text-base" /> Payroll
                </button>
                <button
                  className={`btn btn-md md:btn-md join-item border border-primary ${
                    currentTab === "Deduction"
                      ? "bg-primary text-white border-primary hover:bg-secondary hover:text-white hover:border-primary"
                      : "hover:bg-secondary hover:text-white hover:border-primary bg-white "
                  }`}
                  onClick={() => setCurrentTab("Deduction")}
                >
                  <BsFileMinus className="text-base" /> Deduction
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
