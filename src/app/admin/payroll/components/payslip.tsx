import React from 'react';

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

interface PayslipContentProps {
  employee: Employee;
}

const PayslipContent: React.FC<PayslipContentProps> = ({ employee }) => {
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Payslip for ${employee.name}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .payslip { border: 1px solid #ccc; padding: 20px; max-width: 600px; margin: 0 auto; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <div class="payslip">
            <h2>Payslip for ${employee.name}</h2>
            <table>
              <tr><th>Rate</th><td>${employee.rate.toFixed(2)}</td></tr>
              <tr><th>Days of Work</th><td>${employee.daysOfWork.toFixed(2)}</td></tr>
              <tr><th>Total Regular Wage</th><td>${employee.totalRegularWage.toFixed(2)}</td></tr>
              <tr><th>Overtime</th><td>${employee.overtime.toFixed(2)}</td></tr>
              <tr><th>Holiday</th><td>${employee.holiday.toFixed(2)}</td></tr>
              <tr><th>Total Amount</th><td>${employee.totalAmount.toFixed(2)}</td></tr>
              <tr><th colspan="2">Deductions</th></tr>
              <tr><th>SSS</th><td>${employee.sssDeduction.toFixed(2)}</td></tr>
              <tr><th>PhilHealth</th><td>${employee.philhealthDeduction.toFixed(2)}</td></tr>
              <tr><th>Pag-IBIG</th><td>${employee.pagibigDeduction.toFixed(2)}</td></tr>
              <tr><th>Cash Advance</th><td>${employee.cashAdvance.toFixed(2)}</td></tr>
              <tr><th>Total Deductions</th><td>${employee.totalDeductions.toFixed(2)}</td></tr>
              <tr><th>Total Net Amount</th><td>${employee.totalNetAmount.toFixed(2)}</td></tr>
            </table>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow!.document.write(printContent);
    printWindow!.document.close();
    printWindow!.print();
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Payslip for {employee.name}</h2>
      <table className="w-full border-collapse">
        <tbody>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">Rate</th>
            <td className="border px-4 py-2 text-right">{employee.rate.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">Days of Work</th>
            <td className="border px-4 py-2 text-right">{employee.daysOfWork.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">Total Regular Wage</th>
            <td className="border px-4 py-2 text-right">{employee.totalRegularWage.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">Overtime</th>
            <td className="border px-4 py-2 text-right">{employee.overtime.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">Holiday</th>
            <td className="border px-4 py-2 text-right">{employee.holiday.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">Total Amount</th>
            <td className="border px-4 py-2 text-right">{employee.totalAmount.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left" colSpan={2}>Deductions</th>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">SSS</th>
            <td className="border px-4 py-2 text-right">{employee.sssDeduction.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">PhilHealth</th>
            <td className="border px-4 py-2 text-right">{employee.philhealthDeduction.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">Pag-IBIG</th>
            <td className="border px-4 py-2 text-right">{employee.pagibigDeduction.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">Cash Advance</th>
            <td className="border px-4 py-2 text-right">{employee.cashAdvance.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">Total Deductions</th>
            <td className="border px-4 py-2 text-right">{employee.totalDeductions.toFixed(2)}</td>
          </tr>
          <tr>
            <th className="border px-4 py-2 bg-gray-100 text-left">Total Net Amount</th>
            <td className="border px-4 py-2 text-right">{employee.totalNetAmount.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      <button 
        onClick={handlePrint} 
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Print Payslip
      </button>
    </div>
  );
};

export default PayslipContent;
