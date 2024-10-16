"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "@/firebase";
import Modal from "./components/employeeModal";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { toast } from 'react-toastify';
import { EmployeeDetails } from "./components/employeeModal";
import { deleteObject, ref } from "firebase/storage";
import { BsSearch } from "react-icons/bs";

const FormerEmployee = () => {
  const [employees, setEmployees] = useState<EmployeeDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeDetails[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  //page number
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

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
const handleRestore = async (employeeId: string) => {
  const confirmation = window.confirm(
    "Are you sure you want to restore this employee?"
  );
  if (!confirmation) return;

  try {
    const employeeDoc = await getDoc(doc(db, "former_employees", employeeId));
    if (employeeDoc.exists()) {
      const employeeData = employeeDoc.data();

      // Move the employee data back to the "users" collection
      await setDoc(doc(db, "users", employeeId), {
        ...employeeData,
        restoredAt: new Date(),
      });

      // Delete from "former_employees" collection
      await deleteDoc(doc(db, "former_employees", employeeId));

      // Update local state
      setEmployees(employees.filter((emp) => emp.id !== employeeId));
      setFilteredEmployees(
        filteredEmployees.filter((emp) => emp.id !== employeeId)
      );
      toast.success("Employee restored to users successfully");
    } else {
      toast.error("Employee not found in former employees");
    }
  } catch (error) {
    console.error("Error restoring employee: ", error);
    toast.error("Failed to restore employee");
  }
};

  const handleSearch = () => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
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
  //start of pagenation
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

  return (
    <AdminRouteGuard>
      <div className="container mx-auto p-4 h-full">
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
          <div className="overflow-x-auto">
            <table className="table border dark:border-zinc-600 rounded-lg mb-5 text-sm">
              <thead className="bg-primary">
                <tr className="text-md text-white font-semibold">
                  <th className="px-6 py-3 text-left">Employee ID</th>
                  <th className="px-6 py-3 text-left">Name</th>
                  <th className="px-6 py-3 text-left">Remarks</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800">
                {currentItems.length < 1 ? (
                  <tr>
                    <td colSpan={3} className="text-red-500 text-xs">
                      No results
                    </td>
                  </tr>
                ) : (
                  currentItems.map((employee) => (
                    <tr
                      key={employee.id}
                      onClick={() => handleRowClick(employee)}
                      className={`cursor-pointer dark:text-white dark:border-zinc-600 ${
                        selectedEmployee?.id === employee.id
                          ? "bg-teal-700 text-white hover:bg-teal-600"
                          : "hover:bg-gray-100 dark:hover:text-zinc-800"
                      }`}
                    >
                      <td className="px-4 py-2 text-xs text-left">
                        {employee.employeeId}
                      </td>
                      <td className="px-4 py-2 text-xs text-left">
                        {employee.name}
                      </td>
                      <td className="px-4 py-2 text-xs text-left">
                        {employee.status}
                      </td>
                      <td className="px-4 py-2 text-xs text-left">
                        <button
                          onClick={() => handleRestore(employee.id)}
                          className="btn btn-sm font-normal text-white btn-success"
                        >
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {filteredEmployees.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className={`px-4 bg-primary text-white rounded-lg btn-sm text-sm ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div>{renderPageNumbers()}</div>
                <button
                  className={`px-4 bg-primary text-white rounded-lg btn-sm text-sm ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onEdit={handleEdit}
          onDelete={(employeeId) =>
            handleDelete(employeeId, selectedEmployee?.documentUrls || [])
          }
          employee={selectedEmployee}
        />
      </div>
    </AdminRouteGuard>
  );
};

export default FormerEmployee;