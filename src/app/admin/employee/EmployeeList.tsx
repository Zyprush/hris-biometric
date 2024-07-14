"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "@/firebase";
import Modal from "./components/employeeModal";
import AdminRouteGuard from "@/app/AdminRouteGuard/page";
import { toast } from 'react-toastify';

const EmployeeList = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedEmployees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployees(fetchedEmployees);
      setFilteredEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employees: ", error);
      toast.error("Failed to fetch employees");
    }
  };

  const handleSearch = () => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleEdit = async (updatedEmployee: any) => {
    try {
      const employeeRef = doc(db, "users", updatedEmployee.id);
      await updateDoc(employeeRef, updatedEmployee);
      setEmployees(employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
      setFilteredEmployees(filteredEmployees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
      toast.success("Employee updated successfully");
    } catch (error) {
      console.error("Error updating employee: ", error);
      toast.error("Failed to update employee");
    }
  };

  const handleDelete = async (employeeId: string, documentUrls: string[]) => {
    try {
      // Get the employee document
      const employeeDoc = await getDoc(doc(db, "users", employeeId));
      if (employeeDoc.exists()) {
        const employeeData = employeeDoc.data();

        // Add the employee to the former_employees collection with all data
        await setDoc(doc(db, "former_employees", employeeId), {
          ...employeeData,
          documentUrls: documentUrls, // Store the document URLs
          deletedAt: new Date()
        });

        // Delete employee document from users collection
        await deleteDoc(doc(db, "users", employeeId));

        // Note: We're not deleting the actual documents from Storage
        // This way, we retain access to these documents for former employees
        // If you want to move the documents, you'd need to implement a Storage transfer

        // Update local state
        setEmployees(employees.filter(emp => emp.id !== employeeId));
        setFilteredEmployees(filteredEmployees.filter(emp => emp.id !== employeeId));

        toast.success("Employee moved to former employees successfully");
      } else {
        toast.error("Employee not found");
      }
    } catch (error) {
      console.error("Error moving employee to former employees: ", error);
      toast.error("Failed to move employee to former employees");
    }
  };

  return (
    <AdminRouteGuard>
      <div className="container mx-auto p-4 h-full">
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
          <table className="table-auto w-full border rounded border-gray-200">
            <thead>
              <tr className="text-xs text-gray-500 bg-gray-100">
                <th className="px-4 py-2">Employee ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Remarks</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length < 1 ? (
                <tr>
                  <td colSpan={4} className="text-red-500 text-xs">
                    No results
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-4 py-2 text-xs">{employee.employeeId}</td>
                    <td className="px-4 py-2 text-xs text-gray-600">{employee.name}</td>
                    <td className="px-4 py-2 text-xs text-gray-600">{employee.status}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewDetails(employee)}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEdit}
          onDelete={(employeeId) => handleDelete(employeeId, selectedEmployee?.documentUrls || [])}
          employee={selectedEmployee}
        />
      </div>
    </AdminRouteGuard>
  );
};

export default EmployeeList;