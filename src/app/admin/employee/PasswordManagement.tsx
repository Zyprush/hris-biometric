"use client";
import React, { useEffect, useState } from "react";
import { EmployeeDetails } from "./components/employeeModal";
import { db } from "@/firebase";
import { getDocs, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import AdminChangePassword from "./components/AdminChangePassword";
import { BsSearch } from "react-icons/bs";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";

const PasswordManagement = () => {
  const [employees, setEmployees] = useState<EmployeeDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [change, setChange] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeDetails[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const ADMIN_EMAIL = "hrisbiometric@gmail.com";

  const handleSearch = () => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedEmployees = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            email: data.email || ""
          } as EmployeeDetails;
        })
        .filter((employee) => employee.email !== ADMIN_EMAIL);
      setEmployees(fetchedEmployees);
      setFilteredEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employees: ", error);
      toast.error("Failed to fetch employees");
    }
  };

  return (
    <AdminRouteGuard>
      <div className="container mx-auto p-4 h-full">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            {change && (<AdminChangePassword setChange={setChange} email={email} />)}
            <input
              type="text"
              placeholder="Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-sm input-bordered rounded-sm w-full sm:w-64"
            />
            <div className="flex w-full sm:flex-1 space-x-2">
              <button
                onClick={handleSearch}
                className="btn rounded-md btn-sm btn-primary text-white flex-1 sm:flex-none"
              >
                <BsSearch className="text-xs sm:text-sm" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto card bg-white rounded shadow">
            <table className="table border rounded border-zinc-200 w-full">
              <thead>
                <tr className="text-xs text-white bg-primary">
                  <th className="px-4 py-2">Employee Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length < 1 ? (
                  <tr>
                    <td colSpan={3} className="text-red-500 text-xs text-center">
                      No results
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="px-4 py-2 text-xs text-gray-600 font-semibold">
                        {employee.name}
                      </td>
                      <td className="px-4 py-2 text-xs">{employee.email}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">
                        <button
                          className="btn btn-xs btn-primary text-white"
                          onClick={() => { setChange(true); setEmail(employee.email); }}
                        >
                          change
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
};

export default PasswordManagement;
