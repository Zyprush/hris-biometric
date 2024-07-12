// components/EmploymentInfo.tsx
import React from 'react';

interface EmploymentInfoProps {
  position: string;
  setPosition: (position: string) => void;
  department: string;
  setDepartment: (department: string) => void;
  startDate: string;
  setStartDate: (startDate: string) => void;
  employeeId: string;
  setEmployeeId: (employeeId: string) => void;
}

const EmploymentInfo: React.FC<EmploymentInfoProps> = ({
  position, setPosition, department, setDepartment, startDate, setStartDate, employeeId, setEmployeeId
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Employment Info</h2>
      <input
        type="text"
        onChange={(e) => setPosition(e.target.value)}
        value={position}
        placeholder="Position"
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
      <input
        type="date"
        onChange={(e) => setStartDate(e.target.value)}
        value={startDate}
        placeholder="Start Date"
        required
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="text"
        onChange={(e) => setEmployeeId(e.target.value)}
        value={employeeId}
        placeholder="Employee ID"
        required
        className="w-full p-2 mb-2 border rounded"
      />
    </div>
  );
};

export default EmploymentInfo;