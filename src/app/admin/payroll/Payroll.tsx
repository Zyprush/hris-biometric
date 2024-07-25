"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { toast } from "react-toastify";
import { BsSearch } from "react-icons/bs";
import Modal from "./components/payrollModal"; // You'll need to create this component
import PayslipContent from "./components/payslip"; // You'll need to create this component

interface Employee {
  id: string;
  name: string;
  rate: number;
  daysOfWork: number;
  totalRegularWage: number;
  overtime: number;
  holiday: number;
  totalAmount: number;
  sssDeduction: number;
  philhealthDeduction: number;
  pagibigDeduction: number;
  cashAdvance: number;
  totalDeductions: number;
  totalNetAmount: number;
}

const Payroll: React.FC = () => {
  const [selectAll, setSelectAll] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const fetchedEmployees: Employee[] = querySnapshot.docs
        .map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          const rate = 520; // Fixed rate
          const daysOfWork = data.daysOfWork || 0;
          const overtime = data.overtime || 0;
          const holiday = data.holiday || 0;

          const totalRegularWage = rate * daysOfWork;
          const totalAmount = totalRegularWage + overtime + holiday;

          const sssDeduction = data.sssDeduction || 0;
          const philhealthDeduction = data.philhealthDeduction || 0;
          const pagibigDeduction = data.pagibigDeduction || 0;
          const cashAdvance = data.cashAdvance || 0;

          const totalDeductions = sssDeduction + philhealthDeduction + pagibigDeduction + cashAdvance;

          return {
            id: doc.id,
            name: data.name || "",
            rate,
            daysOfWork,
            totalRegularWage,
            overtime,
            holiday,
            totalAmount,
            sssDeduction,
            philhealthDeduction,
            pagibigDeduction,
            cashAdvance,
            totalDeductions,
            totalNetAmount: totalAmount - totalDeductions,
          };
        })
        .filter((employee: Employee) => employee.name !== "Admin");
      setEmployees(fetchedEmployees);
      setFilteredEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employees: ", error);
      toast.error("Failed to fetch employees");
    }
  };


  const handleSearch = () => {
    const filtered = employees.filter(
      (employee: Employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (employeeId: string) => {
    setSelectedEmployees(prev => {
      const newSelected = prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId];
      setSelectAll(newSelected.length === currentItems.length);
      return newSelected;
    });
  };

  const handlePrintSelected = () => {
    const employeesToPrint = employees.filter(emp => selectedEmployees.includes(emp.id));
    if (employeesToPrint.length > 0) {
      printMultiplePayslips(employeesToPrint);
    } else {
      toast.error("No employees selected for printing");
    }
  };

  const printMultiplePayslips = (employees: Employee[]) => {
    const printContent = employees.map(emp => `
      <div class="p-4 border rounded-lg shadow-lg max-w-lg mx-auto mb-8" style="page-break-after: always;">
        <h2 class="text-2xl font-bold mb-4 text-center">Payslip for ${emp.name}</h2>
        <table class="w-full border-collapse">
          <tbody>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">Rate</th>
              <td class="border px-4 py-2 text-right">${emp.rate.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">Days of Work</th>
              <td class="border px-4 py-2 text-right">${emp.daysOfWork.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">Total Regular Wage</th>
              <td class="border px-4 py-2 text-right">${emp.totalRegularWage.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">Overtime</th>
              <td class="border px-4 py-2 text-right">${emp.overtime.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">Holiday</th>
              <td class="border px-4 py-2 text-right">${emp.holiday.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">Total Amount</th>
              <td class="border px-4 py-2 text-right">${emp.totalAmount.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left" colSpan="2">Deductions</th>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">SSS</th>
              <td class="border px-4 py-2 text-right">${emp.sssDeduction.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">PhilHealth</th>
              <td class="border px-4 py-2 text-right">${emp.philhealthDeduction.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">Pag-IBIG</th>
              <td class="border px-4 py-2 text-right">${emp.pagibigDeduction.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">Cash Advance</th>
              <td class="border px-4 py-2 text-right">${emp.cashAdvance.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">Total Deductions</th>
              <td class="border px-4 py-2 text-right">${emp.totalDeductions.toFixed(2)}</td>
            </tr>
            <tr>
              <th class="border px-4 py-2 bg-gray-100 text-left">Total Net Amount</th>
              <td class="border px-4 py-2 text-right">${emp.totalNetAmount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `).join('');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>Payslips</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>${printContent}</body>
      </html>
    `);
      printWindow.document.close();
      printWindow.print();
    } else {
      toast.error("Unable to open print window. Please check your browser settings.");
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedEmployees(currentItems.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };


  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`btn bg-primary text-white btn-sm rounded-lg px-4 ${currentPage === i
            ? "bg-primary text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    fetchEmployees();
    setSelectAll(false);
  }, []);

  return (
    <AdminRouteGuard>
      <div className="container mx-auto p-4 h-full">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="input input-sm input-bordered rounded-sm w-full sm:w-64"
            />
            <div className="flex w-full sm:flex-1 space-x-2">
              <button
                onClick={handleSearch}
                className="btn rounded-md btn-sm btn-primary text-white flex-1 sm:flex-none"
              >
                <BsSearch className="text-xs sm:text-sm" />
              </button>
              <button
                onClick={handlePrintSelected}
                className={`btn btn-sm rounded-md text-white flex-1 sm:flex-none ${selectedEmployees.length > 0 ? "btn-primary" : "btn-disabled"
                  }`}
                disabled={selectedEmployees.length === 0}
              >
                Print Selected Payslips
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-sm">
            <table className="table-auto rounded-sm border">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="checkbox checkbox-sm"
                    />
                  </th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Name of Employee</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Rate</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Days of Works</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Total Regular Wage</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Overtime</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Holiday</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Total Amount</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" colSpan={4}>Deduction</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Total Deductions</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Total Net Amount</th>
                </tr>
                <tr>
                  <th className="border border-gray-500 px-2 py-1 text-xs">SSS</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs">PHILHEALTH</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs">PAGIBIG</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs">Cash Advance</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentItems.length < 1 ? (
                  <tr>
                    <td colSpan={14} className="text-red-500 text-xs border border-gray-300 px-2 py-1">
                      No results
                    </td>
                  </tr>
                ) : (
                  currentItems.map((employee: Employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleRowClick(employee)}
                    >
                      <td className="px-4 py-2 text-xs border border-b">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleCheckboxChange(employee.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="checkbox checkbox-sm"
                        />
                      </td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.name}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.rate.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.daysOfWork.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.totalRegularWage.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.overtime.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.holiday.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.sssDeduction.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.philhealthDeduction.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.pagibigDeduction.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.cashAdvance.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.totalDeductions.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b">{employee.totalNetAmount.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {filteredEmployees.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className={`px-4 bg-primary text-white rounded-lg btn-sm text-sm ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div>{renderPageNumbers()}</div>
                <button
                  className={`px-4 bg-primary text-white rounded-lg btn-sm text-sm ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedEmployee && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <PayslipContent employee={selectedEmployee} />
        </Modal>
      )}
    </AdminRouteGuard>
  );
};

export default Payroll