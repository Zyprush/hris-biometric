import React, { useState, useEffect } from "react";
import { FaTimes, FaEdit, FaTrash, FaSave } from 'react-icons/fa';

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

  useEffect(() => {
    if (isOpen && employee) {
      setEditedEmployee({ ...employee });
      setIsEditing(false); // Reset edit mode when modal opens or employee changes
    }

    // Cleanup function to reset state when component unmounts or modal closes
    return () => {
      setIsEditing(false);
      setEditedEmployee(null);
    };
  }, [isOpen, employee]);

  if (!isOpen || !employee || !editedEmployee) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEdit(editedEmployee);
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
    setEditedEmployee(prev => ({ ...prev!, [name]: value }));
  };

  const handleCloseModal = () => {
    setIsEditing(false); // Reset edit mode when closing the modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 className="text-3xl font-semibold text-gray-900">{employee.name}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-900 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={handleCloseModal}
            >
              <FaTimes />
            </button>
          </div>
          {/* Body */}
          <div className="relative p-6 flex-auto overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(editedEmployee).map(([key, value]) => (
                key !== 'id' && key !== 'documentUrls' && (
                  <DetailItem
                    key={key}
                    label={key}
                    value={value as string}
                    isEditing={isEditing}
                    onChange={handleInputChange}
                  />
                )
              ))}
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
        className="border rounded px-2 py-1 w-full"
      />
    ) : (
      <span className="text-gray-600">{value}</span>
    )}
  </div>
);

export default Modal;
export type { EmployeeDetails };