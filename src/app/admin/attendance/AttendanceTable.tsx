import React from 'react';

interface AttendanceRecord {
  date: string;
  employeeId: string;
  employeeName: string;
  department: string;
  amIn: string;
  amOut: string;
  pmIn: string;
  pmOut: string;
  otHours: string;
  underTime: string;
  totalHours: string;
}

interface AttendanceTableProps {
  data: AttendanceRecord[];
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-2 py-1 border bg-primary text-white" rowSpan={2}>Date</th>
            <th className="px-2 py-1 border bg-primary text-white" rowSpan={2}>Employee ID</th>
            <th className="px-2 py-1 border bg-primary text-white" rowSpan={2}>Employee Name</th>
            <th className="px-2 py-1 border bg-primary text-white" rowSpan={2}>Department</th>
            <th className="px-2 py-1 border bg-primary text-white" colSpan={2}>AM</th>
            <th className="px-2 py-1 border bg-primary text-white" colSpan={2}>PM</th>
            <th className="px-2 py-1 border bg-primary text-white" rowSpan={2}>OT Hours</th>
            <th className="px-2 py-1 border bg-primary text-white" rowSpan={2}>UnderTime</th>
            <th className="px-2 py-1 border bg-primary text-white" rowSpan={2}>Total Hours</th>
          </tr>
          <tr>
            <th className="px-2 py-1 border bg-primary text-white">Time-in</th>
            <th className="px-2 py-1 border bg-primary text-white">Time-out</th>
            <th className="px-2 py-1 border bg-primary text-white">Time-in</th>
            <th className="px-2 py-1 border bg-primary text-white">Time-out</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr key={index}>
              <td className="px-2 py-1 border">{record.date}</td>
              <td className="px-2 py-1 border">{record.employeeId}</td>
              <td className="px-2 py-1 border">{record.employeeName}</td>
              <td className="px-2 py-1 border">{record.department}</td>
              <td className="px-2 py-1 border">{record.amIn}</td>
              <td className="px-2 py-1 border">{record.amOut}</td>
              <td className="px-2 py-1 border">{record.pmIn}</td>
              <td className="px-2 py-1 border">{record.pmOut}</td>
              <td className="px-2 py-1 border">{record.otHours}</td>
              <td className="px-2 py-1 border">{record.underTime}</td>
              <td className="px-2 py-1 border">{record.totalHours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;