"use client";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import React, { useState } from "react";
import EmployeeList from "./EmployeeList";
import FormerEmployee from "./FormerEmployee";
import AddEmployee from "./AddEmployee";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import { BsPersonBoundingBox, BsPersonDash, BsPersonPlus } from "react-icons/bs";

const Page = () => {
  const [currentTable, setCurrentTable] = useState("Employee");

  const renderTable = () => {
    switch (currentTable) {
      case "Employee":
        return <EmployeeList />;
      case "Add Employee":
        return <AddEmployee />;
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
          <div className="container h-full mx-auto p-4">
            <div className="grid grid-col-1">
              <div className="join rounded-md mb-4">
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTable === "Employee" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTable("Employee")}
                >
                  <BsPersonBoundingBox className="text-base" /> Employee
                </button>
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTable === "Add Employee" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTable("Add Employee")}
                >
                  <BsPersonPlus className="text-base" />
                  Add Employee
                </button>
                <button
                  className={`btn join-item border-2 border-zinc-400 ${currentTable === "Former Employee" ? "bg-primary text-white border-primary" : ""}`}
                  onClick={() => setCurrentTable("Former Employee")}
                >
                  <BsPersonDash className="text-base" />
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
