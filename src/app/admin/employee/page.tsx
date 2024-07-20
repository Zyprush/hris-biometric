"use client";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import React, { useState } from "react";
import EmployeeList from "./EmployeeList";
import FormerEmployee from "./FormerEmployee";
import AddEmployee from "./AddEmployee";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import {
  BsPersonBoundingBox,
  BsPersonDash,
  BsPersonPlus,
} from "react-icons/bs";
import PasswordManagement from "./PasswordManagement";
import { PiPasswordFill } from "react-icons/pi";

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
        case "Password Management":
          return <PasswordManagement />;
      default:
        return <EmployeeList />;
    }
  };

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="container h-full mx-auto p-4">
            <div className="grid grid-col-1 py-4">
              <p className="text-lg font-bold">{currentTable}</p>
   
              <div className="flex justify-center md:justify-start space-x-2 md:space-x-0 my-4">
                <div className="join join-horizontal md:join-horizontal">
                  <button
                    className={`btn btn-md md:btn-md join-item border-2 border-zinc-400 ${
                      currentTable === "Employee"
                        ? "bg-primary text-white border-primary"
                        : ""
                    }`}
                    onClick={() => setCurrentTable("Employee")}
                  >
                    <BsPersonBoundingBox className="text-base md:mr-2" />
                    <span className="hidden md:inline">Employee</span>
                  </button>
                  <button
                    className={`btn btn-md md:btn-md join-item border-2 border-zinc-400 ${
                      currentTable === "Add Employee"
                        ? "bg-primary text-white border-primary"
                        : ""
                    }`}
                    onClick={() => setCurrentTable("Add Employee")}
                  >
                    <BsPersonPlus className="text-base md:mr-2" />
                    <span className="hidden md:inline">Add Employee</span>
                  </button>
                  <button
                    className={`btn btn-md md:btn-md join-item border-2 border-zinc-400 ${
                      currentTable === "Former Employee"
                        ? "bg-primary text-white border-primary"
                        : ""
                    }`}
                    onClick={() => setCurrentTable("Former Employee")}
                  >
                    <BsPersonDash className="text-base md:mr-2" />
                    <span className="hidden md:inline">Former Employee</span>
                  </button>
                  <button
                    className={`btn btn-md md:btn-md join-item border-2 border-zinc-400 ${
                      currentTable === "Password Management"
                        ? "bg-primary text-white border-primary"
                        : ""
                    }`}
                    onClick={() => setCurrentTable("Password Management")}
                  >
                    <PiPasswordFill className="text-base md:mr-2" />
                    <span className="hidden md:inline">Password Management</span>
                  </button>
                </div>
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