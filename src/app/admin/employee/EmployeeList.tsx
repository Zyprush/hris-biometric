"use client";

import React, { useState, useEffect } from "react";
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
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { BsSearch } from "react-icons/bs";

const EmployeeList = () => {
  const { userData } = useUserStore();
  const { addHistory } = useHistoryStore();
  const [employees, setEmployees] = useState<EmployeeDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeDetails[]>(
    []
  );
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const ADMIN_EMAIL = "hrisbiometric@gmail.com";

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
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
  const handleProfilePicUpload = async (file: File, employeeId: string) => {
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
  };
  const handleEdit = async (updatedEmployee: any, newProfilePic: File | null) => {
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
  };

  const handleDelete = async (employeeId: string, documentUrls: string[]) => {
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
              className="input input-sm input-bordered rounded-sm w-full sm:w-64 border-black rounded"
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
          <div className="overflow-x-auto card shadow bg-white rounded">

            <table className="table border rounded">
              <thead>
                <tr className="text-md text-white bg-primary py-4 text-center px-2">
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
                      className={`text-center cursor-pointer ${selectedEmployee?.id === employee.id
                        ? "bg-blue-100 hover:bg-blue-200"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      <td className="px-4 py-2 text-xs">{employee.employeeId}</td>
                      <td className="px-4 py-2 text-xs text-gray-600">
                        {employee.name}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-600">
                        {employee.status}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
