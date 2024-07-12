"use client";
import React, { useState } from "react";

const EmployeeList = () => {
  const employees = [
    { employeeId: "E001", name: "John Doe", remarks: "Permanent" },
    { employeeId: "E002", name: "Jane Smith", remarks: "Contractual" },
    { employeeId: "E003", name: "Alice Johnson", remarks: "Permanent" },
    { employeeId: "E004", name: "Bob Brown", remarks: "Contractual" },
    { employeeId: "E005", name: "Charlie Davis", remarks: "Permanent" },
    { employeeId: "E001", name: "John Doe", remarks: "Permanent" },
    { employeeId: "E002", name: "Jane Smith", remarks: "Contractual" },
    { employeeId: "E003", name: "Alice Johnson", remarks: "Permanent" },
    { employeeId: "E004", name: "Bob Brown", remarks: "Contractual" },
    { employeeId: "E005", name: "Charlie Davis", remarks: "Permanent" },
    { employeeId: "E001", name: "John Doe", remarks: "Permanent" },
    { employeeId: "E002", name: "Jane Smith", remarks: "Contractual" },
    { employeeId: "E003", name: "Alice Johnson", remarks: "Permanent" },
    { employeeId: "E004", name: "Bob Brown", remarks: "Contractual" },
    { employeeId: "E005", name: "Charlie Davis", remarks: "Permanent" },
    { employeeId: "E001", name: "John Doe", remarks: "Permanent" },
    { employeeId: "E002", name: "Jane Smith", remarks: "Contractual" },
    { employeeId: "E003", name: "Alice Johnson", remarks: "Permanent" },
    { employeeId: "E004", name: "Bob Brown", remarks: "Contractual" },
    { employeeId: "E005", name: "Charlie Davis", remarks: "Permanent" },
    { employeeId: "E001", name: "John Doe", remarks: "Permanent" },
    { employeeId: "E002", name: "Jane Smith", remarks: "Contractual" },
    { employeeId: "E003", name: "Alice Johnson", remarks: "Permanent" },
    { employeeId: "E004", name: "Bob Brown", remarks: "Contractual" },
    { employeeId: "E005", name: "Charlie Davis", remarks: "Permanent" },
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
    <div className="container mx-auto p-4">
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

export default EmployeeList;
