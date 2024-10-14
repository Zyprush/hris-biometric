"use client";
import {AdminRouteGuard} from "@/components/AdminRouteGuard";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { useState } from "react";
import { BsBuilding, BsBuildingFill } from "react-icons/bs";
import DepartmentList from "./DepartmentList";
import Branch from "./Branch";

const AdminBranch = () => {
  const [currentTab, setCurrentTab] = useState("Department");

  const renderContent = () => {
    switch (currentTab) {
      case "Department":
        return <DepartmentList />;
      case "Branch":
        return <Branch />;
      default:
        return <DepartmentList />;
    }
  };

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="container h-full mx-auto p-4">
            <div className="grid grid-col-1 py-4">
              <p className="text-lg font-bold dark:text-white">{currentTab}</p>
              <div className="join rounded-md my-5">
                <button
                  className={`btn btn-md md:btn-md join-item border border-primary ${
                    currentTab === "Department"
                      ? "bg-primary text-white border-primary hover:bg-secondary hover:text-white hover:border-primary"
                      : "hover:bg-secondary hover:text-white hover:border-primary bg-white "
                  }`}
                  onClick={() => setCurrentTab("Department")}
                >
                  <BsBuilding className="text-base" /> Department
                </button>
                <button
                  className={`btn btn-md md:btn-md join-item border border-primary ${
                    currentTab === "Branch"
                      ? "bg-primary text-white border-primary hover:bg-secondary hover:text-white hover:border-primary"
                      : "hover:bg-secondary hover:text-white hover:border-primary bg-white "
                  }`}
                  onClick={() => setCurrentTab("Branch")}
                >
                  <BsBuildingFill className="text-base" /> Branch
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
