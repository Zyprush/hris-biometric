import React from 'react';
import { toast } from 'react-toastify';

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

interface PrintPayslipsProps {
  employees: Employee[];
}

const PrintPayslips: React.FC<PrintPayslipsProps> = ({ employees }) => {
  const printMultiplePayslips = () => {
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

  return (
    <button
      onClick={printMultiplePayslips}
      className={`btn btn-sm rounded-md text-white ${employees.length > 0 ? "btn-primary" : "btn-disabled"}`}
      disabled={employees.length === 0}
    >
      Print Selected Payslips
    </button>
  );
};

export default PrintPayslips;