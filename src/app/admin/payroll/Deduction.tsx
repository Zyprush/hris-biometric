"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { toast, ToastContainer } from "react-toastify";
import { BsSearch } from "react-icons/bs";
import DeductionModal from "./components/deductionModal";  // Make sure this path is correct

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  sssDeduction: number;
  philhealthDeduction: number;
  pagibigDeduction: number;
  cashAdvance: number;
}

const Deduction: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedEmployees: Employee[] = querySnapshot.docs
        .map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          employeeId: doc.data().employeeId || "",
          id: doc.id,
          name: doc.data().name || "",
          department: doc.data().department || "",
          sssDeduction: doc.data().sssDeduction || 0,
          philhealthDeduction: doc.data().philhealthDeduction || 0,
          pagibigDeduction: doc.data().pagibigDeduction || 0,
          cashAdvance: doc.data().cashAdvance || 0,
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
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
  };

  const handleViewDetails = () => {
    if (selectedEmployee) {
      setEditedEmployee({ ...selectedEmployee });
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedEmployee) {
      const { name, value } = e.target;
      setEditedEmployee({
        ...editedEmployee,
        [name]: value,
      });
    }
  };

  const handleSave = async () => {
    if (editedEmployee) {
      try {
        const userRef = doc(db, "users", editedEmployee.id);
        await updateDoc(userRef, {
          cashAdvance: parseFloat(editedEmployee.cashAdvance.toString()) || 0,
          sssDeduction: parseFloat(editedEmployee.sssDeduction.toString()) || 0,
          philhealthDeduction: parseFloat(editedEmployee.philhealthDeduction.toString()) || 0,
          pagibigDeduction: parseFloat(editedEmployee.pagibigDeduction.toString()) || 0,
        });
        toast.success("Employee deductions updated successfully");
        setIsModalOpen(false);
        fetchEmployees(); // Refresh the employee list
      } catch (error) {
        console.error("Error updating employee: ", error);
        toast.error("Failed to update employee deductions");
      }
    }
  };

  return (
    <AdminRouteGuard>
      <div className="container mx-auto p-4 h-full">
        <ToastContainer />
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
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
                className={`btn btn-sm rounded-md text-white flex-1 sm:flex-none ${
                  selectedEmployee ? "btn-primary" : "btn-disabled"
                }`}
                disabled={!selectedEmployee}
              >
                <span className="text-xs sm:text-sm">View Details</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto card shadow bg-white rounded">
            <table className="table border rounded">
              <thead>
                <tr className="text-md bg-primary text-white">
                  <th className="px-4 py-2">Employee ID</th>
                  <th className="px-4 py-2">Employee Name</th>
                  <th className="px-4 py-2">Department</th>
                  <th className="px-4 py-2">Cash Advance</th>
                  <th className="px-4 py-2">SSS</th>
                  <th className="px-4 py-2">PHIC</th>
                  <th className="px-4 py-2">PAGIBIG</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length < 1 ? (
                  <tr>
                    <td colSpan={7} className="text-red-500 text-xs border border-gray-300 px-2 py-1">
                      No results
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee: Employee) => (
                    <tr
                      key={employee.id}
                      onClick={() => handleRowClick(employee)}
                      className={`cursor-pointer ${
                        selectedEmployee?.id === employee.id
                          ? "bg-blue-100 hover:bg-blue-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <td className="px-2 py-1 text-xs">{employee.employeeId}</td>
                      <td className="px-2 py-1 text-xs">{employee.name}</td>
                      <td className="px-2 py-1 text-xs">{employee.department}</td>
                      <td className="px-2 py-1 text-xs">{employee.cashAdvance.toFixed(2)}</td>
                      <td className="px-2 py-1 text-xs">{employee.sssDeduction.toFixed(2)}</td>
                      <td className="px-2 py-1 text-xs">{employee.philhealthDeduction.toFixed(2)}</td>
                      <td className="px-2 py-1 text-xs">{employee.pagibigDeduction.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <DeductionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        employee={editedEmployee}
        onSave={handleSave}
        onInputChange={handleInputChange}
      />
    </AdminRouteGuard>
  );
};

export default Deduction;