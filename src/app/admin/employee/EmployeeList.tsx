"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase";
import Modal from "./components/employeeModal";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { toast } from "react-toastify";
import { EmployeeDetails } from "./components/employeeModal";
import { useHistoryStore } from "@/state/history";
import { useUserStore } from "@/state/user";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { BsSearch } from "react-icons/bs";

const EmployeeList = () => {
  const { userData } = useUserStore();
  const { addHistory } = useHistoryStore();
  const [employees, setEmployees] = useState<EmployeeDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeDetails[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const ADMIN_EMAIL = "hrisbiometric@gmail.com";

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    setFilteredEmployees(employees);
  }, [employees]);

  const fetchEmployees = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedEmployees = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "",
            nickname: data.nickname || "",
            employeeId: data.employeeId || "",
            email: data.email || "",
            phone: data.phone || "",
            birthday: data.birthday || "",
            gender: data.gender || "",
            nationality: data.nationality || "",
            currentAddress: data.currentAddress || "",
            maritalStatus: data.maritalStatus || "",
            permanentAddress: data.permanentAddress || "",
            emergencyContactName: data.emergencyContactName || "",
            emergencyContactPhone: data.emergencyContactPhone || "",
            emergencyContactAddress: data.emergencyContactAddress || "",
            position: data.position || "",
            department: data.department || "",
            branch: data.branch || "",
            startDate: data.startDate || "",
            status: data.status || "",
            supervisor: data.supervisor || "",
            sss: data.sss || "",
            philHealthNumber: data.philHealthNumber || "",
            pagIbigNumber: data.pagIbigNumber || "",
            tinNumber: data.tinNumber || "",
            role: data.role || "",
            documentUrls: data.documentUrls || [],
            profilePicUrl: data.profilePicUrl || "",
          } as EmployeeDetails;
        })
        .filter((employee) => employee.email !== ADMIN_EMAIL);
      setEmployees(fetchedEmployees);
      setFilteredEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employees: ", error);
      toast.error("Failed to fetch employees");
    }
  }, [ADMIN_EMAIL]);

  const handleSearch = useCallback(() => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [employees, searchTerm]);

  const handleRowClick = useCallback((employee: EmployeeDetails) => {
    setSelectedEmployee(employee);
  }, []);

  const handleViewDetails = useCallback(() => {
    if (selectedEmployee) {
      setIsModalOpen(true);
    }
  }, [selectedEmployee]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  }, []);

  const handleProfilePicUpload = useCallback(async (file: File, employeeId: string) => {
    try {
      const profilePicRef = ref(storage, `profile_pictures/${employeeId}/${file.name}`);
      const profilePicSnapshot = await uploadBytes(profilePicRef, file);
      const downloadURL = await getDownloadURL(profilePicSnapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture: ", error);
      toast.error("Failed to upload profile picture");
      return null;
    }
  }, []);

  const handleEdit = useCallback(async (updatedEmployee: EmployeeDetails, newProfilePic: File | null) => {
    try {
      let profilePicUrl = updatedEmployee.profilePicUrl;

      if (newProfilePic) {
        const uploadedUrl = await handleProfilePicUpload(newProfilePic, updatedEmployee.id);
        if (uploadedUrl) {
          profilePicUrl = uploadedUrl;
        }
      }

      const employeeRef = doc(db, "users", updatedEmployee.id);
      await updateDoc(employeeRef, { ...updatedEmployee, profilePicUrl });

      const updatedEmployeeWithPic = { ...updatedEmployee, profilePicUrl };

      setEmployees(
        employees.map((emp) =>
          emp.id === updatedEmployee.id ? updatedEmployeeWithPic : emp
        )
      );
      setFilteredEmployees(
        filteredEmployees.map((emp) =>
          emp.id === updatedEmployee.id ? updatedEmployeeWithPic : emp
        )
      );
      toast.success("Employee updated successfully");
    } catch (error) {
      console.error("Error updating employee: ", error);
      toast.error("Failed to update employee");
    }
  }, [employees, filteredEmployees, handleProfilePicUpload]);

  const handleDelete = useCallback(async (employeeId: string, documentUrls: string[]) => {
    try {
      const employeeDoc = await getDoc(doc(db, "users", employeeId));
      if (employeeDoc.exists()) {
        const employeeData = employeeDoc.data();

        await setDoc(doc(db, "former_employees", employeeId), {
          ...employeeData,
          documentUrls: documentUrls,
          deletedAt: new Date(),
        });

        await deleteDoc(doc(db, "users", employeeId));
        const currentDate = new Date().toISOString();
        await addHistory({
          adminId: userData?.id,
          text: `${userData?.name} deleted ${employeeData?.name} account`,
          userId: employeeData?.id,
          time: currentDate,
          addedBy: "admin"
        });
        setEmployees(employees.filter((emp) => emp.id !== employeeId));
        setFilteredEmployees(
          filteredEmployees.filter((emp) => emp.id !== employeeId)
        );

        toast.success("Employee moved to former employees successfully");
      } else {
        toast.error("Employee not found");
      }
    } catch (error) {
      console.error("Error moving employee to former employees: ", error);
      toast.error("Failed to move employee to former employees");
    }
  }, [addHistory, employees, filteredEmployees, userData]);

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
              className="input input-sm input-bordered rounded-sm w-full sm:w-64 border-black"
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
                      className={`cursor-pointer dark:border-zinc-600 hover:dark:bg-gray-600 dark:text-white ${selectedEmployee?.id === employee.id
                        ? "bg-teal-700 text-white hover:bg-teal-600"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      <td className="px-4 py-2 text-xs text-left">{employee.employeeId}</td>
                      <td className="px-4 py-2 text-xs text-left">
                        {employee.name}
                      </td>
                      <td className="px-4 py-2 text-xs text-left">
                        {employee.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {filteredEmployees.length > itemsPerPage && (
              <div className="flex justify-between items-center">
                <button
                  className={`px-4 bg-primary text-white rounded-lg btn-sm text-sm text-center align-center ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div>{renderPageNumbers()}</div>
                <button
                  className={`px-4 bg-primary text-white rounded-lg btn-sm text-sm ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
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

export default EmployeeList;
