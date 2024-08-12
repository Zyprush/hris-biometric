"use client";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { useState } from "react";
import { BsCalendarCheck, BsChatLeft } from "react-icons/bs";
import AdminHistory from "./AdminHistory";
import UserHistory from "./UserHistory";


const AdminAttendance = () => {
  const [currentTab, setCurrentTab] = useState("Admin History");

  const renderContent = () => {
    switch (currentTab) {
      case "Admin History":
        return <AdminHistory />;
      case "User History":
        return <UserHistory />;
      default:
        return <AdminHistory />;
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
                    currentTab === "Admin History"
                      ? "bg-primary text-white border-primary hover:bg-secondary hover:text-white hover:border-primary"
                      : "hover:bg-secondary hover:text-white hover:border-primary bg-white "
                  }`}
                  onClick={() => setCurrentTab("Admin History")}
                >
                  <BsChatLeft className="text-base" /> Admin History
                </button>
                <button
                  className={`btn btn-md md:btn-md join-item border border-primary ${
                    currentTab === "User History"
                      ? "bg-primary text-white border-primary hover:bg-secondary hover:text-white hover:border-primary"
                      : "hover:bg-secondary hover:text-white hover:border-primary bg-white "
                  }`}
                  onClick={() => setCurrentTab("User History")}
                >
                  <BsCalendarCheck className="text-base" /> User History
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
