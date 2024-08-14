import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getDatabase, ref, get, child } from "firebase/database";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// Define types for attendance records
interface AttendanceRecord {
  type: string;
  time: string;
}

interface AttendanceData {
  [key: string]: AttendanceRecord;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    fill: boolean;
  }[];
}

const calculateWorkingHours = (attendanceRecords: AttendanceData): { totalHours: number; overtimeHours: any } => {
  let totalHours = 0;
  let overtimeHours = 0;

  // Convert attendance records to an array for processing
  const recordsArray = Object.values(attendanceRecords);

  // Sort records to ensure Check-in is processed before Check-out
  recordsArray.sort((a, b) => a.time.localeCompare(b.time));

  for (let i = 0; i < recordsArray.length - 1; i++) {
    const checkInRecord = recordsArray[i];
    const checkOutRecord = recordsArray[i + 1];

    if (checkInRecord.type === "Check-in" && checkOutRecord.type === "Check-out") {
      const checkInDate = new Date(`1970-01-01T${checkInRecord.time}Z`);
      const checkOutDate = new Date(`1970-01-01T${checkOutRecord.time}Z`);
      const diff = (checkOutDate.getTime() - checkInDate.getTime()) / 1000 / 3600; // Convert milliseconds to hours

      totalHours += diff;

      if (totalHours > 8) {
        overtimeHours += totalHours - 8;
      }
    }
  }

  return { totalHours, overtimeHours };
};

const fetchAttendanceData = async (userRefId: string, setChartData: React.Dispatch<React.SetStateAction<ChartData>>) => {
  const dbRef = ref(getDatabase());
  const last10DaysAttendance: { date: string; data: any }[] = [];

  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const dateKey = new Date(today);
    dateKey.setDate(today.getDate() - i);
    const dateString = dateKey.toISOString().split("T")[0];

    const snapshot = await get(child(dbRef, `attendance/${dateString}`));
    if (snapshot.exists()) {
      const data = snapshot.val() as AttendanceData;
      if (data[userRefId]) {
        last10DaysAttendance.push({ date: dateString, data: data[userRefId] });
      }
    }
  }

  const regularHours: number[] = [];
  const overtimeHours: number[] = [];
  const labels: string[] = [];

  last10DaysAttendance.forEach((attendance) => {
    const { totalHours, overtimeHours } = calculateWorkingHours(attendance.data);
    regularHours.push(totalHours);
    overtimeHours.push(overtimeHours);
    labels.push(attendance.date);
  });

  setChartData({
    labels,
    datasets: [
      {
        label: "Regular Hours",
        data: regularHours,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: true,
      },
      {
        label: "Overtime Hours",
        data: overtimeHours,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: true,
      },
    ],
  });
};

const Productivity: React.FC<{ userRefId: string }> = ({ userRefId }) => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    fetchAttendanceData(userRefId, setChartData);
  }, [userRefId]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Attendance and Overtime",
      },
    },
    scales: {
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Hours",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 col-span-full md:col-span-2 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-neutral dark:text-white">
        Attendance and Overtime
      </h2>
      <Line options={options} data={chartData} />
    </div>
  );
};

export default Productivity;
