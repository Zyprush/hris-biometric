import { useHistoryStore } from "@/state/history";
import { useUserStore } from "@/state/user";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaTimes, FaEdit, FaTrash, FaSave, FaUser, FaEnvelope, FaPhone, FaBriefcase, FaBuilding } from 'react-icons/fa';

interface EmployeeDetails {
  id: string;
  name: string;
  nickname: string;
  employeeId: string;
  email: string;
  phone: string;
  birthday: string;
  gender: string;
  nationality: string;
  currentAddress: string;
  permanentAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactAddress: string;
  position: string;
  department: string;
  branch: string;
  startDate: string;
  status: string;
  supervisor: string;
  sss: string;
  philHealthNumber: string;
  pagIbigNumber: string;
  tinNumber: string;
  role: string;
  documentUrls?: string[];
  profilePicture?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employee: EmployeeDetails) => void;
  onDelete: (employeeId: string, documentUrls: string[]) => void;
  employee: EmployeeDetails | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onEdit, onDelete, employee }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<EmployeeDetails | null>(null);
  const { userData } = useUserStore();
  const { addHistory } = useHistoryStore();

  useEffect(() => {
    if (isOpen && employee) {
      setEditedEmployee({ ...employee });
      setIsEditing(false);
    }
    return () => {
      setIsEditing(false);
      setEditedEmployee(null);
    };
  }, [isOpen, employee]);

  if (!isOpen || !employee || !editedEmployee) return null;

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    onEdit(editedEmployee);
    const currentDate = new Date().toISOString();
    addHistory({
      adminId: userData?.id,
      text: `${userData?.name} edited ${employee.name} account`,
      time: currentDate,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${employee.name}'s record?`)) {
      onDelete(employee.id, employee.documentUrls || []);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedEmployee(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-8xl mx-9 my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-gray-100 border-b border-solid border-gray-300 rounded-t">
            <h3 className="text-3xl font-bold text-gray-900">{employee.name}</h3>
            <button
              className="p-1 ml-auto text-gray-900 text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={handleCloseModal}
            >
              <FaTimes />
            </button>
          </div>
          {/* Body */}
          <div className="relative p-6 flex-auto overflow-y-auto max-h-[70vh]">
            <div className="flex flex-col md:flex-row">
              {/* Left column - Photo and basic info */}
              <div className="w-full md:w-1/3 pr-4 mb-6 md:mb-0">
                <div className="mb-6 flex justify-center">
                  <div className="relative w-48 h-48 mx-auto">
                    <Image
                      src={editedEmployee.profilePicture || "/img/profile-admin.jpg"}
                      alt={editedEmployee.name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-3 m-9">
                  <InfoItem icon={<FaBriefcase />} label="Position" value={editedEmployee.position} />
                  <InfoItem icon={<FaBuilding />} label="Department" value={editedEmployee.department} />
                  <InfoItem icon={<FaEnvelope />} label="Email" value={editedEmployee.email} />
                  <InfoItem icon={<FaPhone />} label="Phone" value={editedEmployee.phone} />
                </div>
              </div>
              {/* Right column - Detailed info */}
              <div className="w-full md:w-2/3">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Employee ID" value={editedEmployee.employeeId} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="Birthday" value={editedEmployee.birthday} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="Gender" value={editedEmployee.gender} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="Nationality" value={editedEmployee.nationality} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="Current Address" value={editedEmployee.currentAddress} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="Permanent Address" value={editedEmployee.permanentAddress} isEditing={isEditing} onChange={handleInputChange} />
                </div>

                <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Employment Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="Branch" value={editedEmployee.branch} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="Start Date" value={editedEmployee.startDate} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="Status" value={editedEmployee.status} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="Supervisor" value={editedEmployee.supervisor} isEditing={isEditing} onChange={handleInputChange} />
                </div>

                <h4 className="text-xl font-semibold text-gray-900 mt-6 mb-4">Government IDs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem label="SSS" value={editedEmployee.sss} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="PhilHealth Number" value={editedEmployee.philHealthNumber} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="Pag-IBIG Number" value={editedEmployee.pagIbigNumber} isEditing={isEditing} onChange={handleInputChange} />
                  <DetailItem label="TIN Number" value={editedEmployee.tinNumber} isEditing={isEditing} onChange={handleInputChange} />
                </div>

                {editedEmployee.documentUrls && editedEmployee.documentUrls.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Documents</h4>
                    <ul className="list-disc pl-5">
                      {editedEmployee.documentUrls.map((url, index) => (
                        <DocumentListItem key={index} url={url} />
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
            {isEditing ? (
              <button
                className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-4 mb-1 ease-linear transition-all duration-150 flex items-center"
                type="button"
                onClick={handleSave}
              >
                <FaSave className="mr-2" /> Save
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-4 mb-1 ease-linear transition-all duration-150 flex items-center"
                type="button"
                onClick={handleEdit}
              >
                <FaEdit className="mr-2" /> Edit
              </button>
            )}
            <button
              className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 flex items-center"
              type="button"
              onClick={handleDelete}
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center space-x-2">
    <span className="text-gray-600">{icon}</span>
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-800">{value}</span>
  </div>
);

const DetailItem: React.FC<{
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, value, isEditing, onChange }) => (
  <div className="mb-2">
    <span className="font-semibold text-gray-700">{label}: </span>
    {isEditing ? (
      <input
        type="text"
        name={label}
        value={value}
        onChange={onChange}
        className="border rounded px-2 py-1 w-full mt-1"
      />
    ) : (
      <span className="text-gray-800">{value}</span>
    )}
  </div>
);

const DocumentListItem: React.FC<{ url: string }> = ({ url }) => {
  const decodedUrl = decodeURIComponent(url);
  const fileName = decodedUrl.split('/').pop()?.split('?')[0] || 'Unknown Document';
  return (
    <li className="text-blue-500 hover:underline">
      <a href={url} target="_blank" rel="noopener noreferrer">
        {fileName}
      </a>
    </li>
  );
};

export default Modal;
export type { EmployeeDetails };