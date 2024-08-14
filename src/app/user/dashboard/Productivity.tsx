import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getDatabase, ref, get, child } from "firebase/database";

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

const calculateWorkingHours = (attendanceRecords: any) => {
  let totalHours = 0;
  let overtimeHours = 0;

  Object.keys(attendanceRecords).forEach((key) => {
    const record = attendanceRecords[key];
    const checkInTime = record.type === "Check-in" ? record.time : null;
    const checkOutTime = record.type === "Check-out" ? record.time : null;

    if (checkInTime && checkOutTime) {
      const checkInDate = new Date(`1970-01-01T${checkInTime}Z`);
      const checkOutDate = new Date(`1970-01-01T${checkOutTime}Z`);
      const diff = (checkOutDate.getTime() - checkInDate.getTime()) / 1000 / 3600; // Convert milliseconds to hours

      totalHours += diff;

      if (totalHours > 8) {
        overtimeHours += totalHours - 8;
      }
    }
  });

  return { totalHours, overtimeHours };
};

const fetchAttendanceData = async (userRefId: string, setChartData: React.Dispatch<React.SetStateAction<ChartData>>) => {
  const dbRef = ref(getDatabase());
  const last10DaysAttendance: { date: string; data: AttendanceData }[] = [];

  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const dateKey = new Date(today);
    dateKey.setDate(today.getDate() - i);
    const dateString = dateKey.toISOString().split("T")[0];

    const snapshot = await get(child(dbRef, `attendance/${dateString}`));
    if (snapshot.exists()) {
      const dailyData = snapshot.val();
      const userAttendance: AttendanceData = {};

      Object.keys(dailyData).forEach((userId) => {
        if (userId === userRefId) {
          userAttendance[userId] = dailyData[userId];
        }
      });

      if (Object.keys(userAttendance).length > 0) {
        last10DaysAttendance.push({ date: dateString, data: userAttendance });
      }
    }
  }

  const regularHours: number[] = [];
  const overtimeHours: number[] = [];
  const labels: string[] = [];

  last10DaysAttendance.forEach((attendance) => {
    let totalHours = 0;
    let overtime = 0;

    Object.values(attendance.data).forEach((record) => {
      const { totalHours: regular, overtimeHours: overtimeCalculated } = calculateWorkingHours(record);
      totalHours += regular;
      overtime += overtimeCalculated;
    });

    regularHours.push(totalHours);
    overtimeHours.push(overtime);
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

const Productivity: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const userRefId = "3"; // Replace with the actual userRefId

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
