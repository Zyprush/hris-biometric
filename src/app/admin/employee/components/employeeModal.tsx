import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any; // Type for employee data
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, employee }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        {/* Modal content */}
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t">
            <h3 className="text-xl font-semibold">{employee.name}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <span className="text-black">×</span>
            </button>
          </div>
          {/* Body */}
          <div className="relative p-6 flex-auto">
            <p className="my-4 text-gray-600">{`Employee ID: ${employee.employeeId}`}</p>
            {/* Add more details here as needed */}
          </div>
          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t border-solid rounded-b">
            <button
              className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
