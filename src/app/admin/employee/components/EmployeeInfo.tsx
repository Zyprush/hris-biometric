// components/EmploymentInfo.tsx
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface EmploymentInfoProps {
  employeeId: string;
  setEmployeeId: (employeeId: string) => void;
  rate: number;
  setRate: (rate: number) => void;
  position: string;
  setPosition: (position: string) => void;
  department: string;
  setDepartment: (department: string) => void;
  branch: string;
  setBranch: (branch: string) => void;
  startDate: string;
  setStartDate: (startDate: string) => void;
  status: string;
  setStatus: (status: string) => void;
  supervisor: string;
  setSupervisor: (supervisor: string) => void;
  profilePic: File | null;
  setProfilePic: (profilePic: File | null) => void;
}

const EmploymentInfo: React.FC<EmploymentInfoProps> = ({
  employeeId, setEmployeeId, position, setPosition, department, setDepartment, branch, setBranch, startDate, setStartDate, status, setStatus, supervisor, setSupervisor, profilePic, setProfilePic, rate, setRate
}) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const departmentsCollection = collection(db, 'departments');
      const departmentSnapshot = await getDocs(departmentsCollection);
      const departmentList = departmentSnapshot.docs.map(doc => doc.data().name);
      setDepartments(departmentList);
    };

    const fetchBranches = async () => {
      const branchesCollection = collection(db, 'branches');
      const branchSnapshot = await getDocs(branchesCollection);
      const branchList = branchSnapshot.docs.map(doc => doc.data().name);
      setBranches(branchList);
    };

    fetchDepartments();
    fetchBranches();
  }, []);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Employment Info</h2>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full px-2 mb-4">
          <label htmlFor="profilePic" className="text-sm text-gray-500 mb-1">Choose Profile (optional)</label>
          <input
            type="file"
            id="profilePic"
            onChange={handleProfilePicChange}
            accept="image/*"
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="employeeId" className="text-sm text-gray-500 mb-1">Employee ID</label>
          <input
            type="text"
            id="employeeId"
            onChange={(e) => setEmployeeId(e.target.value)}
            value={employeeId}
            placeholder="Employee ID"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="rate" className="text-sm text-gray-500 mb-1">Rate</label>
          <input
            type="number"
            id="rate"
            onChange={(e) => setRate(parseFloat(e.target.value))}
            value={rate}
            placeholder="Rate/day"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="position" className="text-sm text-gray-500 mb-1">Job Title</label>
          <input
            type="text"
            id="position"
            onChange={(e) => setPosition(e.target.value)}
            value={position}
            placeholder="Job Title"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="department" className="text-sm text-gray-500 mb-1">Department</label>
          <select
            id="department"
            onChange={(e) => setDepartment(e.target.value)}
            value={department}
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          >
            <option value="">Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="branch" className="text-sm text-gray-500 mb-1">Branch</label>
          <select
            id="branch"
            onChange={(e) => setBranch(e.target.value)}
            value={branch}
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          >
            <option value="">Select Branch</option>
            {branches.map((branch, index) => (
              <option key={index} value={branch}>{branch}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="startDate" className="text-sm text-gray-500 mb-1">Employment Start Date</label>
          <input
            type="date"
            id="startDate"
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="status" className="text-sm text-gray-500 mb-1">Status</label>
          <select
            id="status"
            onChange={(e) => setStatus(e.target.value)}
            value={status}
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          >
            <option value="">Select Status</option>
            <option value="Permanent">Permanent</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div className="w-full md:w-1/2 px-2 mb-4">
          <label htmlFor="supervisor" className="text-sm text-gray-500 mb-1">Supervisor</label>
          <input
            type="text"
            id="supervisor"
            onChange={(e) => setSupervisor(e.target.value)}
            value={supervisor}
            placeholder="Supervisor"
            required
            className="w-full p-2 border rounded dark:bg-zinc-200"
          />
        </div>
      </div>
    </div>


  );
};

export default EmploymentInfo;
