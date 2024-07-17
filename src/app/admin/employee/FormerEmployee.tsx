"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "@/firebase";
import Modal from "./components/employeeModal";
import {AdminRouteGuard} from "@/components/AdminRouteGuard";
import { toast } from 'react-toastify';
import { EmployeeDetails } from "./components/employeeModal";
import { deleteObject, ref } from "firebase/storage";
import { deleteUser, getAuth } from "firebase/auth";

const FormerEmployee = () => {
  const [employees, setEmployees] = useState<EmployeeDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeDetails[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const ADMIN_EMAIL = "hrisbiometric@gmail.com";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "former_employees"));
      const fetchedEmployees = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          nickname: data.nickname || '',
          employeeId: data.employeeId || '',
          email: data.email || '',
          phone: data.phone || '',
          birthday: data.birthday || '',
          gender: data.gender || '',
          nationality: data.nationality || '',
          currentAddress: data.currentAddress || '',
          permanentAddress: data.permanentAddress || '',
          emergencyContactName: data.emergencyContactName || '',
          emergencyContactPhone: data.emergencyContactPhone || '',
          emergencyContactAddress: data.emergencyContactAddress || '',
          position: data.position || '',
          department: data.department || '',
          branch: data.branch || '',
          startDate: data.startDate || '',
          status: data.status || '',
          supervisor: data.supervisor || '',
          sss: data.sss || '',
          philHealthNumber: data.philHealthNumber || '',
          pagIbigNumber: data.pagIbigNumber || '',
          tinNumber: data.tinNumber || '',
          role: data.role || '',
          documentUrls: data.documentUrls || [],
        } as EmployeeDetails;
      }).filter((employee) => employee.email !== ADMIN_EMAIL);
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

  const handleRowClick = (employee: any) => {
    setSelectedEmployee(employee);
  };

  const handleViewDetails = () => {
    if (selectedEmployee) {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleEdit = async (updatedEmployee: any) => {
    try {
      const employeeRef = doc(db, "former_employees", updatedEmployee.id);
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
      // Delete employee document from Firestore
      await deleteDoc(doc(db, "former_employees", employeeId));
      // Delete associated documents from Storage
      for (const url of documentUrls) {
        const fileRef = ref(storage, url);
        await deleteObject(fileRef);
      }
      // Update local state
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      setFilteredEmployees(filteredEmployees.filter(emp => emp.id !== employeeId));
      toast.success("Employee and associated documents deleted successfully");
    } catch (error) {
      console.error("Error deleting employee and documents: ", error);
      toast.error("Failed to delete employee and associated documents");
    }
  };

  return (
    <AdminRouteGuard>
      <div className="container mx-auto p-4 h-full">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 w-full max-w-sm">
              <input
                type="text"
                placeholder="Search by name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-sm input-bordered rounded-sm flex-grow"
              />
              <button onClick={handleSearch} className="btn rounded-md btn-sm btn-primary text-white">
                Search
              </button>
            </div>
            <button
              onClick={handleViewDetails}
              className={`btn btn-sm rounded-md text-white ml-2 ${selectedEmployee ? 'btn-primary' : 'btn-disabled'}`}
              disabled={!selectedEmployee}
            >
              View Details
            </button>
          </div>
          <table className="table border rounded border-zinc-200">
            <thead>
              <tr className="text-xs text-gray-500 bg-gray-100">
                <th className="px-4 py-2">Employee ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length < 1 ? (
                <tr>
                  <td colSpan={3} className="text-red-500 text-xs">
                    No results
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    onClick={() => handleRowClick(employee)}
                    className={`cursor-pointer ${selectedEmployee?.id === employee.id ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-100'}`}
                  >
                    <td className="px-4 py-2 text-xs">{employee.employeeId}</td>
                    <td className="px-4 py-2 text-xs text-gray-600">{employee.name}</td>
                    <td className="px-4 py-2 text-xs text-gray-600">{employee.status}</td>
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

export default FormerEmployee;