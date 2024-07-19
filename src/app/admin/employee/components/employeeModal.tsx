import { useHistoryStore } from "@/state/history";
import { useUserStore } from "@/state/user";
import React, { useState, useEffect } from "react";
import { FaTimes, FaEdit, FaTrash, FaSave, FaUser, FaIdCard, FaAddressCard, FaBriefcase, FaFileAlt } from 'react-icons/fa';
import Image from 'next/image';

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
  maritalStatus: string;
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
  profilePicUrl?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employee: EmployeeDetails, newProfilePic: File | null) => void;
  onDelete: (employeeId: string, documentUrls: string[]) => void;
  employee: EmployeeDetails | null;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onEdit, onDelete, employee }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<EmployeeDetails | null>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const { userData } = useUserStore();
  const { addHistory } = useHistoryStore();
  const [newProfilePic, setNewProfilePic] = useState<File | null>(null);
  const [tempProfilePicUrl, setTempProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && employee) {
      setEditedEmployee({ ...employee });
      setIsEditing(false);
      setNewProfilePic(null);
      setTempProfilePicUrl(null);
    }
    return () => {
      setIsEditing(false);
      setNewProfilePic(null);
      if (tempProfilePicUrl) {
        URL.revokeObjectURL(tempProfilePicUrl);
        setTempProfilePicUrl(null);
      }
    };
  }, [isOpen, employee]);

  if (!isOpen || !employee || !editedEmployee) return null;

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    if (editedEmployee) {
      await onEdit(editedEmployee, newProfilePic);
      const currentDate = new Date().toISOString();
      await addHistory({
        adminId: userData?.id,
        text: `${userData?.name} edited ${editedEmployee.name} account`,
        time: currentDate,
        userId: editedEmployee?.id
      });
      setIsEditing(false);
      
      // Update the local state to reflect changes
      setEditedEmployee(prevState => ({
        ...prevState!,
        profilePicUrl: newProfilePic ? URL.createObjectURL(newProfilePic) : prevState!.profilePicUrl
      }));
      
      setNewProfilePic(null);
      if (tempProfilePicUrl) {
        URL.revokeObjectURL(tempProfilePicUrl);
        setTempProfilePicUrl(null);
      }
    }
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
    setIsEditing(false);
    setNewProfilePic(null);
    if (tempProfilePicUrl) {
      URL.revokeObjectURL(tempProfilePicUrl);
      setTempProfilePicUrl(null);
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfilePic(file);
      const tempUrl = URL.createObjectURL(file);
      setTempProfilePicUrl(tempUrl);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: FaUser },
    { id: 'contact', label: 'Contact', icon: FaAddressCard },
    { id: 'employment', label: 'Employment', icon: FaBriefcase },
    { id: 'documents', label: 'Documents', icon: FaFileAlt },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="name" value={editedEmployee.name} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="nickname" value={editedEmployee.nickname} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="birthday" value={editedEmployee.birthday} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="gender" value={editedEmployee.gender} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="nationality" value={editedEmployee.nationality} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="maritalStatus" value={editedEmployee.maritalStatus} isEditing={isEditing} onChange={handleInputChange} />
          </div>
        );
      case 'contact':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="email" value={editedEmployee.email} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="phone" value={editedEmployee.phone} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="currentAddress" value={editedEmployee.currentAddress} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="permanentAddress" value={editedEmployee.permanentAddress} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="emergencyContactName" value={editedEmployee.emergencyContactName} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="emergencyContactPhone" value={editedEmployee.emergencyContactPhone} isEditing={isEditing} onChange={handleInputChange} />
          </div>
        );
      case 'employment':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="employeeId" value={editedEmployee.employeeId} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="position" value={editedEmployee.position} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="department" value={editedEmployee.department} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="branch" value={editedEmployee.branch} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="startDate" value={editedEmployee.startDate} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="status" value={editedEmployee.status} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="supervisor" value={editedEmployee.supervisor} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="sss" value={editedEmployee.sss} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="philHealthNumber" value={editedEmployee.philHealthNumber} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="pagIbigNumber" value={editedEmployee.pagIbigNumber} isEditing={isEditing} onChange={handleInputChange} />
            <DetailItem label="tinNumber" value={editedEmployee.tinNumber} isEditing={isEditing} onChange={handleInputChange} />
          </div>
        );
      case 'documents':
        return (
          <div>
            {editedEmployee.documentUrls && editedEmployee.documentUrls.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {editedEmployee.documentUrls.map((url, index) => (
                  <DocumentListItem key={index} url={url} />
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No documents available.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-solid border-gray-200 rounded-t bg-gray-100">
            <h3 className="text-3xl font-semibold text-gray-900">{editedEmployee.name}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-600 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-900 transition-colors duration-200"
              onClick={handleCloseModal}
            >
              <FaTimes />
            </button>
          </div>
          {/* Body */}
          <div className="relative p-6 flex-auto overflow-y-auto max-h-[70vh]">
            <div className="flex flex-col md:flex-row">
              {/* Profile Picture */}
              <div className="w-full md:w-1/3 mb-4 md:mb-0 md:mr-6">
                <div className="rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48 mx-auto mb-4">
                  <img
                      src={tempProfilePicUrl || editedEmployee?.profilePicUrl || "/img/profile-admin.jpg"}
                      alt={editedEmployee?.name}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                  {isEditing && (
                    <div className="mt-2">
                      <label htmlFor="profile-pic-upload" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200">
                        Choose New Picture
                      </label>
                      <input
                        id="profile-pic-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 text-center">
                  <h4 className="text-xl font-semibold">{editedEmployee.name}</h4>
                  <p className="text-gray-600">{editedEmployee.position}</p>
                </div>
              </div>
              {/* Tabs and Employee Details */}
              <div className="w-full md:w-2/3">
                <div className="mb-4 border-b border-gray-200">
                  <ul className="flex flex-wrap -mb-px">
                    {tabs.map((tab) => (
                      <li className="mr-2" key={tab.id}>
                        <button
                          className={`inline-flex items-center py-2 px-4 text-sm font-medium text-center rounded-t-lg border-b-2 ${activeTab === tab.id
                            ? 'text-blue-600 border-blue-600'
                            : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300'
                            }`}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          <tab.icon className="mr-2" />
                          {tab.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                {renderTabContent()}
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-200 rounded-b bg-gray-50">
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
    <span className="font-semibold text-gray-700 capitalize">{label.replace(/([A-Z])/g, ' $1').trim()}: </span>
    {isEditing ? (
      <input
        type="text"
        name={label}
        value={value}
        onChange={onChange}
        className="border rounded px-2 py-1 w-full mt-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    ) : (
      <span className="text-gray-600">{value}</span>
    )}
  </div>
);

const DocumentListItem: React.FC<{ url: string }> = ({ url }) => {
  const decodedUrl = decodeURIComponent(url);
  const fileName = decodedUrl.split('/').pop()?.split('?')[0] || 'Unknown Document';
  return (
    <li className="bg-gray-100 p-3 rounded-lg hover:bg-gray-200 transition-colors duration-200">
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
        <FaFileAlt className="mr-2" /> {fileName}
      </a>
    </li>
  );
};


export default Modal;
export type { EmployeeDetails };