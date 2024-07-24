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
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetails | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

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
    setCurrentPage(1);
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

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`btn bg-primary text-white btn-sm rounded-lg px-4 ${currentPage === i
            ? "bg-primary text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handleViewDetails = () => {
    if (selectedEmployee) {
      setChange(true);
      setEmail(selectedEmployee.email);
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
              <button
                onClick={handleViewDetails}
                className={`btn btn-sm rounded-md text-white flex-1 sm:flex-none ${selectedEmployee ? "btn-primary" : "btn-disabled"
                  }`}
                disabled={!selectedEmployee}
              >
                <span className="text-xs sm:text-sm">Reset Password</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto card">
            <table className="table border rounded-lg">
              <thead className="bg-primary">
                <tr className="text-xs text-white bg-primary">
                  <th className="px-6 py-3">Employee Name</th>
                  <th className="px-6 py-3">Email</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredEmployees.length < 1 ? (
                  <tr>
                    <td colSpan={2} className="text-red-500 text-xs text-center">
                      No results
                    </td>
                  </tr>
                ) : (
                  currentItems.map((employee) => (
                    <tr
                      key={employee.id}
                      className={`cursor-pointer ${selectedEmployee?.id === employee.id
                        ? "bg-teal-700 text-white hover:bg-teal-600"
                        : "hover:bg-gray-100"
                        }`}
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <td className="px-4 py-2 text-xs text-left">
                        {employee.name}
                      </td>
                      <td className="px-4 py-2 text-xs text-left">{employee.email}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {filteredEmployees.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className={`px-4 bg-primary text-white rounded-lg btn-sm text-sm ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div>{renderPageNumbers()}</div>
                <button
                  className={`px-4 bg-primary text-white rounded-lg btn-sm text-sm ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
};

export default PasswordManagement;
