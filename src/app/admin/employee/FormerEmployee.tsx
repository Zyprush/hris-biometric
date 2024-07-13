"use client";
import React, { useState } from "react";

const FormerEmployee = () => {
  const employees = [
    { employeeId: "E003", name: "Alice Johnson", remarks: "Permanent" },
    { employeeId: "E004", name: "Bob Brown", remarks: "Contractual" },
    { employeeId: "E006", name: "David Wilson", remarks: "Permanent" },
    { employeeId: "E007", name: "Emma Thomas", remarks: "Permanent" },
    { employeeId: "E008", name: "Frank White", remarks: "Contractual" },
    { employeeId: "E009", name: "Grace Hall", remarks: "Permanent" },
    { employeeId: "E010", name: "Henry King", remarks: "Contractual" },
    { employeeId: "E011", name: "Ivy Scott", remarks: "Permanent" },
    { employeeId: "E012", name: "Jack Green", remarks: "Permanent" },
    { employeeId: "E013", name: "Kathy Adams", remarks: "Contractual" },
    { employeeId: "E014", name: "Liam Baker", remarks: "Permanent" },
    { employeeId: "E015", name: "Mia Clark", remarks: "Contractual" },
    { employeeId: "E016", name: "Noah Lewis", remarks: "Permanent" },

  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  const handleSearch = () => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  return (
    <div className="container mx-auto p-4 borde">
      <div className="grid grid-col-1 gap-4">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-sm input-bordered mr-2 rounded-sm w-full max-w-sm"
          />
          <button onClick={handleSearch} className="btn rounded-md btn-sm btn-primary text-white">
            Search
          </button>
        </div>
        <table className="table table-zebra border rounded border-zinc-200">
          <thead>
            <tr className="text-xs text-zinc-500">
              <th>Employee ID </th>
              <th>Name</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length < 1 ? (
              <tr>
                <td colSpan={3} className="text-red-500 text-xs">
                  {" "}
                  No result
                </td>
              </tr>
            ) : (
              filteredEmployees.map((info, ind) => (
                <tr key={ind}>
                  <td className="text-xs">{info.employeeId}</td>
                  <td className="text-xs text-zinc-600">{info.name}</td>
                  <td className="text-xs text-zinc-600">{info.remarks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormerEmployee;
