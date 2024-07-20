"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { toast } from "react-toastify";
import { BsSearch } from "react-icons/bs";

interface Employee {
  id: string;
  name: string;
  rate: number;
  daysOfWork: number;
  totalRegularWage: number;
  overtime: number;
  holiday: number;
  totalAmount: number;
  sss: number;
  philhealth: number;
  pagibig: number;
  cashAdvance: number;
  totalDeductions: number;
  totalNetAmount: number;
}

const Payroll: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedEmployees: Employee[] = querySnapshot.docs
        .map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          name: doc.data().name || "",
          rate: doc.data().rate || 0,
          daysOfWork: doc.data().daysOfWork || 0,
          totalRegularWage: doc.data().totalRegularWage || 0,
          overtime: doc.data().overtime || 0,
          holiday: doc.data().holiday || 0,
          totalAmount: doc.data().totalAmount || 0,
          sss: doc.data().sss || 0,
          philhealth: doc.data().philhealth || 0,
          pagibig: doc.data().pagibig || 0,
          cashAdvance: doc.data().cashAdvance || 0,
          totalDeductions: doc.data().totalDeductions || 0,
          totalNetAmount: doc.data().totalNetAmount || 0,
        }))
        .filter((employee: Employee) => employee.name !== "Admin");
      setEmployees(fetchedEmployees);
      setFilteredEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employees: ", error);
      toast.error("Failed to fetch employees");
    }
  };

  const handleSearch = () => {
    const filtered = employees.filter(
      (employee: Employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  return (
    <AdminRouteGuard>
      <div className="container mx-auto p-4 h-full">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="input input-sm input-bordered rounded-sm w-full sm:w-64"
            />
            <button
              onClick={handleSearch}
              className="btn rounded-md btn-sm btn-primary text-white flex-1 sm:flex-none"
            >
              <BsSearch className="text-xs sm:text-sm" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-xs" rowSpan={2}>NAME OF EMPLOYEE</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs" rowSpan={2}>RATE</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs" rowSpan={2}>DAYS OF WORK</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs" rowSpan={2}>TOTAL REGULAR WAGE</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs" rowSpan={2}>OVERTIME</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs" rowSpan={2}>HOLIDAY</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs" rowSpan={2}>TOTAL AMOUNT</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs" colSpan={4}>DEDUCTIONS</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs" rowSpan={2}>TOTAL DEDUCTIONS</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs" rowSpan={2}>TOTAL NET AMOUNT</th>
                </tr>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-2 py-1 text-xs">SSS</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs">PHILHEALTH</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs">PAGIBIG</th>
                  <th className="border border-gray-300 px-2 py-1 text-xs">CASH ADVANCE</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length < 1 ? (
                  <tr>
                    <td colSpan={13} className="text-red-500 text-xs border border-gray-300 px-2 py-1">
                      No results
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee: Employee) => (
                    <tr key={employee.id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 px-2 py-1 text-xs">{employee.name}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">{employee.rate.toFixed(2)}</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">0</td>
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

export default Payroll;