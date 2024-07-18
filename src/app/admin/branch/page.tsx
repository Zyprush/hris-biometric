"use client";

import {AdminRouteGuard} from "@/components/AdminRouteGuard";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { useState } from "react";
import { BsCashStack, BsFileMinus } from "react-icons/bs";
import Department from "./Department";
import Branch from "./Branch";

const AdminBranch = () => {
  const [currentTab, setCurrentTab] = useState("Department");

  const renderContent = () => {
    switch (currentTab) {
      case "Department":
        return <Department />;
      case "Branch":
        return <Branch />;
      default:
        return <Department />;
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
                  className={`btn join-item border-2 border-zinc-400 ${currentTab === "Department" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTab("Department")}
                >
                  <BsCashStack className="text-base" /> Department
                </button>
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTab === "Branch" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTab("Branch")}
                >
                  <BsFileMinus className="text-base" /> Branch
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

export default AdminBranch;
