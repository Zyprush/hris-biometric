import React from 'react';

interface Employee {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  sssDeduction: number;
  philhealthDeduction: number;
  pagibigDeduction: number;
  cashAdvance: number;
}

interface DeductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  onSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DeductionModal: React.FC<DeductionModalProps> = ({ isOpen, onClose, employee, onSave, onInputChange }) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md transform transition-all duration-300">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Edit Deductions</h2>
        <div className="space-y-6">
          {[
            { id: "cashAdvance", label: "Cash Advance" },
            { id: "sssDeduction", label: "SSS Deduction" },
            { id: "philhealthDeduction", label: "PhilHealth Deduction" },
            { id: "pagibigDeduction", label: "PAGIBIG Deduction" }
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="number"
                id={field.id}
                name={field.id}
                value={employee[field.id as keyof typeof employee]}
                onChange={onInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out dark:bg-zinc-400 p-1"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeductionModal;
