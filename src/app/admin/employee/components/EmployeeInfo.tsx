// components/EmploymentInfo.tsx
import React, { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface EmploymentInfoProps {
  employeeId: string;
  setEmployeeId: (employeeId: string) => void;
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
}

const EmploymentInfo: React.FC<EmploymentInfoProps> = ({
  employeeId, setEmployeeId, position, setPosition, department, setDepartment, branch, setBranch, startDate, setStartDate, status, setStatus, supervisor, setSupervisor
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

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Employment Info</h2>
      <input
        type="text"
        onChange={(e) => setEmployeeId(e.target.value)}
        value={employeeId}
        placeholder="Employee ID"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        onChange={(e) => setPosition(e.target.value)}
        value={position}
        placeholder="Job Title"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <select
        onChange={(e) => setDepartment(e.target.value)}
        value={department}
        required
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Department</option>
        {departments.map((dept, index) => (
          <option key={index} value={dept}>{dept}</option>
        ))}
      </select>
      <select
        onChange={(e) => setBranch(e.target.value)}
        value={branch}
        required
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Branch</option>
        {branches.map((branch, index) => (
          <option key={index} value={branch}>{branch}</option>
        ))}
      </select>
      <div className="flex flex-col mb-2">
        <label htmlFor="startDate" className="text-sm text-gray-500 mb-1">
          Employment Start Date
        </label>
        <input
          type="date"
          onChange={(e) => setStartDate(e.target.value)}
          value={startDate}
          required
          className="w-full p-2 mb-2 border rounded"
        />
      </div>
      <select
        onChange={(e) => setStatus(e.target.value)}
        value={status}
        required
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select Status</option>
        <option value="Permanent">Permanent</option>
        <option value="Contract">Contract</option>
        <option value="Intern">Intern</option>
      </select>
      <input
        type="text"
        onChange={(e) => setSupervisor(e.target.value)}
        value={supervisor}
        placeholder="Supervisor"
        required
        className="w-full p-2 mb-2 border rounded"
      />
    </div>
  );
};

export default EmploymentInfo;
