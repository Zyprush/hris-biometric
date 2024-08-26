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
  ChartOptions,
  ChartData,
} from "chart.js";
import { ref, get, DataSnapshot } from "firebase/database";
import { rtdb } from "@/firebase";

ChartJS.register(
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

interface ProductivityProps {
  userIdRef: string;
}

interface AttendanceEntry {
  id: string;
  name: string;
  state: string;
  time: string;
  type: "Check-in" | "Check-out" | "Overtime-in" | "Overtime-out";
}

interface DataEntry {
  date: string;
  hours: number;
}

function isValidAttendanceEntry(entry: any): entry is AttendanceEntry {
  return (
    typeof entry.id === 'string' &&
    typeof entry.name === 'string' &&
    typeof entry.state === 'string' &&
    typeof entry.time === 'string' &&
    ['Check-in', 'Check-out', 'Overtime-in', 'Overtime-out'].includes(entry.type)
  );
}

const Productivity: React.FC<ProductivityProps> = ({ userIdRef }) => {
  const [regularHoursData, setRegularHoursData] = useState<DataEntry[]>([]);
  const [overtimeData, setOvertimeData] = useState<DataEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      if (userIdRef) {
        try {
          const userRef = ref(rtdb, `users/${userIdRef}`);
          const userSnapshot: DataSnapshot = await get(userRef);
          const userData = userSnapshot.val();
          if (userData && userData.userid) {
            setUserId(userData.userid);
          } else {
            console.warn(`No valid RTDB data found for user with userIdRef: ${userIdRef}`);
          }
        } catch (error) {
          console.error(`Error fetching RTDB data for user with userIdRef: ${userIdRef}:`, error);
        }
      } else {
        console.warn(`No userIdRef provided`);
      }
    };

    fetchUserId();
  }, [userIdRef]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (userId) {
        try {
          const attendanceRef = ref(rtdb, `attendance`);
          const attendanceSnapshot: DataSnapshot = await get(attendanceRef);
          const attendanceData = attendanceSnapshot.val();

          const regularHours: { [date: string]: number } = {};
          const overtime: { [date: string]: number } = {};

          Object.entries(attendanceData).forEach(([date, dateData]: [string, any]) => {
            const dailyEntries: Partial<Record<AttendanceEntry['type'], string>> = {};

            Object.values(dateData).forEach((userEntries: any) => {
              Object.values(userEntries).forEach((entry: any) => {
                if (entry.id === userId && isValidAttendanceEntry(entry)) {
                  // Only store the first punch of each type
                  if (!dailyEntries[entry.type]) {
                    dailyEntries[entry.type] = entry.time;
                  }
                }
              });
            });

            // Calculate hours based on the first punch of each type
            const calculateHours = (inTime: string, outTime: string) => {
              const [inHours, inMinutes] = inTime.split(':').map(Number);
              const [outHours, outMinutes] = outTime.split(':').map(Number);
              return (outHours * 60 + outMinutes - (inHours * 60 + inMinutes)) / 60;
            };

            if (dailyEntries['Check-in'] && dailyEntries['Check-out']) {
              regularHours[date] = calculateHours(dailyEntries['Check-in'], dailyEntries['Check-out']);
            }

            if (dailyEntries['Overtime-in'] && dailyEntries['Overtime-out']) {
              overtime[date] = calculateHours(dailyEntries['Overtime-in'], dailyEntries['Overtime-out']);
            }

            // Cap regular hours at 8 and move excess to overtime
            if (regularHours[date] > 8) {
              overtime[date] = (overtime[date] || 0) + (regularHours[date] - 8);
              regularHours[date] = 8;
            }
          });

          setRegularHoursData(Object.entries(regularHours).map(([date, hours]) => ({ date, hours })));
          setOvertimeData(Object.entries(overtime).map(([date, hours]) => ({ date, hours })));
        } catch (error) {
          console.error(`Error fetching attendance data:`, error);
        }
      }
    };

    fetchAttendanceData();
  }, [userId]);

  const chartData: ChartData<"line"> = {
    labels: regularHoursData.map((entry) => entry.date),
    datasets: [
      {
        label: "Regular Hours",
        data: regularHoursData.map((entry) => entry.hours),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
        fill: true,
      },
      {
        label: "Overtime Hours",
        data: overtimeData.map((entry) => entry.hours),
        borderColor: "rgba(255, 0, 0, 1)",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
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