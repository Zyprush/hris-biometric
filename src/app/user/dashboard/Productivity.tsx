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
import { getDatabase, ref, get } from "firebase/database";
import { format, subDays, parse, isBefore } from "date-fns";

ChartJS.register(
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const Productivity: React.FC<{ userRefId: string }> = ({ userRefId }) => {
  const [dailyHours, setDailyHours] = useState<
    { date: string; hours: number }[]
  >([]);
  // console.log("userRefId", userRefId);
  useEffect(() => {
    const fetchWorkingHours = async () => {
      const db = getDatabase();
      const today = new Date();
      const daysAgo10 = subDays(today, 10);
      const formattedToday = format(today, "yyyy-MM-dd");
      // const formattedDaysAgo10 = format(daysAgo10, "yyyy-MM-dd");

      const dailyHoursMap: { [key: string]: number } = {};

      // Fetch data from Firebase
      const snapshot = await get(ref(db, "attendance"));

      if (!snapshot.exists()) {
        console.log("No data available");
        return;
      }

      const data = snapshot.val();

      // Process each day's data
      for (const date in data) {
        if (
          isBefore(parse(date, "yyyy-MM-dd", new Date()), daysAgo10) ||
          date > formattedToday
        ) {
          continue;
        }

        const dailyData = data[date][`id_${userRefId}`];
        if (!dailyData) continue;

        const checkIns: Date[] = [];
        const checkOuts: Date[] = [];

        // Separate check-ins and check-outs
        for (const key in dailyData) {
          const entry = dailyData[key];
          const entryTime = parse(entry.time, "HH:mm:ss", new Date());

          if (entry.type === "Check-in") {
            checkIns.push(entryTime);
          } else if (entry.type === "Check-out") {
            checkOuts.push(entryTime);
          }
        }

        // Calculate working hours for the day
        checkIns.sort();
        checkOuts.sort();

        let dailyHours = 0;
        while (checkIns.length > 0 && checkOuts.length > 0) {
          const checkInTime = checkIns.shift();
          const checkOutTime = checkOuts.shift();

          if (checkInTime && checkOutTime) {
            dailyHours +=
              (checkOutTime.getTime() - checkInTime.getTime()) /
              (1000 * 60 * 60); // Convert milliseconds to hours
          }
        }

        dailyHoursMap[date] = dailyHours;
      }

      // Create array of daily hours
      const sortedDates = Array.from({ length: 10 }, (_, i) =>
        format(subDays(today, 10 - i), "yyyy-MM-dd")
      );
      const dailyHoursArray = sortedDates.map((date) => ({
        date,
        hours: dailyHoursMap[date] || 0,
      }));

      setDailyHours(dailyHoursArray);
    };

    fetchWorkingHours();
  }, [userRefId]);

  // Prepare data for the chart
  const chartData = {
    labels: dailyHours.map((entry) => entry.date),
    datasets: [
      {
        label: "Working Hours",
        data: dailyHours.map((entry) => entry.hours),
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
