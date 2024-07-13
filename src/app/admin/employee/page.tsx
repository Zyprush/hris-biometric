"use client";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import React, { useState } from "react";
import EmployeeList from "./EmployeeList";
import FormerEmployee from "./FormerEmployee";
import AddEmployee from "./AddEmployee";
import AdminRouteGuard from "@/app/AdminRouteGuard/page";

const Page = () => {
  const [currentTable, setCurrentTable] = useState("Employee");

  const renderTable = () => {
    switch (currentTable) {
      case "Employee":
        return <EmployeeList />;
      case "Add Employee":
        return <AddEmployee />; // Placeholder for Add Employee component
      case "Former Employee":
        return <FormerEmployee />;
      default:
        return <EmployeeList />;
    }
  };

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="container mx-auto p-4">
            <div className="grid grid-col-1 py-4">
              <p className="text-lg font-bold">{currentTable}</p>
              <div className="join rounded-md my-5">
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTable === "Employee" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTable("Employee")}
                >
                  Employee
                </button>
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTable === "Add Employee" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTable("Add Employee")}
                >
                  Add Employee
                </button>
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTable === "Former Employee" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTable("Former Employee")}
                >
                  Former Employee
                </button>
              </div>
              {renderTable()}
            </div>
          </div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default Page;
