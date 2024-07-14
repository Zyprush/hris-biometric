// components/EmploymentInfo.tsx
import { stat } from 'fs';
import React from 'react';

interface EmploymentInfoProps {
  employeeId: string;
  setEmployeeId: (employeeId: string) => void;
  position: string;
  setPosition: (position: string) => void;
  department: string;
  setDepartment: (department: string) => void;
  startDate: string;
  setStartDate: (startDate: string) => void;
  status: string;
  setStatus: (status: string) => void;
  supervisor: string;
  setSupervisor: (supervisor: string) => void;
}

const EmploymentInfo: React.FC<EmploymentInfoProps> = ({
  employeeId, setEmployeeId, position, setPosition, department, setDepartment, startDate, setStartDate, status, setStatus, supervisor, setSupervisor
}) => {
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
      <input
        type="text"
        onChange={(e) => setDepartment(e.target.value)}
        value={department}
        placeholder="Department"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <div className="flex flex-col mb-2">
        <label htmlFor="birthday" className="text-sm text-gray-500 mb-1">
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
      <h2 className="text-md font-bold mb-4">Employment Info</h2>
    </div>
  );
};

export default EmploymentInfo;