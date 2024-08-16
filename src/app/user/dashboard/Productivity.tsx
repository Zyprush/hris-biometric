"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { getOvertimeData } from "./overtimeData";
import { getWorkHours } from "./workHours";

ChartJS.register(
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const Productivity: React.FC<{ userRefId: string }> = ({ userRefId }) => {
  const [overtimeData, setOvertimeData] = useState<
    { date: string; hours: number }[]
  >([]);
  const [workHoursData, setWorkHoursData] = useState<
    { date: string; hours: number }[]
  >([]);
  useEffect(() => {
    const fetchData = async () => {
      const overtimedata = await getOvertimeData(userRefId);
      setOvertimeData(overtimedata);
      const workdata = await getWorkHours(userRefId);
      setWorkHoursData(workdata);
    };

    fetchData();
  }, [userRefId]);

  const chartData = {
    labels: overtimeData.map((entry) => entry.date),
    datasets: [
      {
        label: "Overtime Hours",
        data: overtimeData.map((entry) => entry.hours),
        borderColor: "rgba(255, 0, 0, 1)",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 1,
        fill: true,
      },
      {
        label: "Working Hours",
        data: workHoursData.map((entry) => entry.hours),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Hours",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 col-span-full md:col-span-2 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-neutral dark:text-white">
        Attendance and Overtime
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Productivity;
