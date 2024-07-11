"use client";
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import React, { useState } from "react";
import EmployeeList from "./EmployeeList";
import FormerEmployee from "./FormerEmployee";

const Page = () => {
  const [currentTable, setCurrentTable] = useState("Employee");

  const renderTable = () => {
    switch (currentTable) {
      case "Employee":
        return <EmployeeList />;
      case "Add Employee":
        return <div>Add Employee Component</div>; // Placeholder for Add Employee component
      case "Former Employee":
        return <FormerEmployee />;
      default:
        return <EmployeeList />;
    }
  };

  return (
    <SignedIn>
      <AdminLayout>
        <div className="flex items-center p-5 flex-col">
          <p className="text-lg font-bold">{currentTable}</p>
          <div className="join rounded-md my-5">
            <button className="btn join-item border-2 border-zinc-400" onClick={() => setCurrentTable("Employee")}>Employee</button>
            <button className="btn join-item border-2 border-zinc-400" onClick={() => setCurrentTable("Add Employee")}>Add Employee</button>
            <button className="btn join-item border-2 border-zinc-400" onClick={() => setCurrentTable("Former Employee")}>Former Employee</button>
          </div>
          {renderTable()}
        </div>
      </AdminLayout>
    </SignedIn>
  );
};

export default Page;
