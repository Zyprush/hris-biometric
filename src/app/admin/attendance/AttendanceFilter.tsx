import React, { useState } from 'react';

interface AttendanceFiltersProps {
  fromDate: string;
  toDate: string;
  searchTerm: string;
  selectedDepartment: string;
  departments: string[];
  onFromDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDepartmentChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  fromDate,
  toDate,
  searchTerm,
  selectedDepartment,
  departments,
  onFromDateChange,
  onToDateChange,
  onSearchChange,
  onDepartmentChange,
}) => {
  const [isToDateModifiedByUser, setIsToDateModifiedByUser] = useState(false);

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFromDate = e.target.value;
    
    // If to date hasn't been manually modified, set it to the same as from date
    if (!isToDateModifiedByUser) {
      onToDateChange({ 
        target: { value: newFromDate } 
      } as React.ChangeEvent<HTMLInputElement>);
    }
    
    // Ensure from date is not after to date
    if (newFromDate > toDate) {
      onToDateChange({ 
        target: { value: newFromDate } 
      } as React.ChangeEvent<HTMLInputElement>);
    }
    
    onFromDateChange(e);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mark that the user has manually modified the to date
    setIsToDateModifiedByUser(true);
    
    // Ensure to date is not before from date
    const newToDate = e.target.value;
    if (newToDate < fromDate) {
      onFromDateChange({ 
        target: { value: newToDate } 
      } as React.ChangeEvent<HTMLInputElement>);
    }
    
    onToDateChange(e);
  };

  return (
    <div className="mb-4 flex space-x-4">
      <div>
        <label htmlFor="fromDate" className="block text-sm font-medium">
          From:
        </label>
        <input
          type="date"
          id="fromDate"
          value={fromDate}
          onChange={handleFromDateChange}
          className="border p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="toDate" className="block text-sm font-medium">
          To:
        </label>
        <input
          type="date"
          id="toDate"
          value={toDate}
          onChange={handleToDateChange}
          className="border p-2 rounded"
        />
      </div>
      <div>
        <label htmlFor="search" className="block text-sm font-medium">
          Search by Employee Name:
        </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={onSearchChange}
          className="border p-2 rounded"
          placeholder="Search..."
        />
      </div>
      <div>
        <label htmlFor="department" className="block text-sm font-medium">
          Department:
        </label>
        <select
          id="department"
          value={selectedDepartment}
          onChange={onDepartmentChange}
          className="border p-2 rounded"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AttendanceFilters;