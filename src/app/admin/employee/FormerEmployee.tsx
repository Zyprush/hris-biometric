"use client";

import AdminRouteGuard from "@/app/AdminRouteGuard/page";
import React, { useState, useEffect } from "react";
import { collection, getDocs, DocumentData, Timestamp } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust this import path as needed

interface Employee extends DocumentData {
  id: string;
  name: string;
  remarks: string;
  deletedAt: Timestamp;
  documentUrls?: string[];
}

const FormerEmployee: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchFormerEmployees = async () => {
      const formerEmployeesCollection = collection(db, "former_employees");
      const formerEmployeesSnapshot = await getDocs(formerEmployeesCollection);
      const formerEmployeesList = formerEmployeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Employee));
      setEmployees(formerEmployeesList);
      setFilteredEmployees(formerEmployeesList);
    };

    fetchFormerEmployees();
  }, []);

  const handleSearch = () => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  return (
    <AdminRouteGuard>
      <div className="container mx-auto p-4 border">
        <div className="grid grid-cols-1 gap-4">
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
                <th>Employee ID</th>
                <th>Name</th>
                <th>Remarks</th>
                <th>Deleted At</th>
                <th>Documents</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length < 1 ? (
                <tr>
                  <td colSpan={5} className="text-red-500 text-xs">
                    No result
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="text-xs">{employee.employeeId}</td>
                    <td className="text-xs text-zinc-600">{employee.name}</td>
                    <td className="text-xs text-zinc-600">{employee.status}</td>
                    <td className="text-xs text-zinc-600">
                      {employee.deletedAt.toDate().toLocaleDateString()}
                    </td>
                    <td className="text-xs text-zinc-600">
                      {employee.documentUrls && employee.documentUrls.length > 0 ? (
                        <ul>
                          {employee.documentUrls.map((url, index) => (
                            <li key={index}>
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                Document {index + 1}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No documents"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminRouteGuard>
  );
};

export default FormerEmployee;