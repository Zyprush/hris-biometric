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
  Filler,
} from "chart.js";
import { ref, get, DataSnapshot } from "firebase/database";
import { collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { db, rtdb } from "@/firebase";
import { differenceInMinutes, parseISO, format } from "date-fns";

ChartJS.register(
  LineElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Filler
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
  regularHours: number;
  overtimeHours: number;
}

interface FirestoreUser {
  employeeId: string;
  name: string;
  department: string;
  userIdRef: string;
}

interface RTDBUser {
  cardno: string;
  name: string;
  userid: string;
}

const calculateTimeDifference = (start: string, end: string): number => {
  const startDate = parseISO(`2000-01-01T${start}`);
  const endDate = parseISO(`2000-01-01T${end}`);
  return differenceInMinutes(endDate, startDate) / 60; // Convert minutes to hours
};

const isAMTime = (time: string): boolean => {
  if (!time) return false;
  const [hours] = time.split(':');
  const hour = parseInt(hours, 10);
  return hour >= 5 && hour < 13;
};

const assignTimeEntries = (checkIns: string[], checkOuts: string[]): { amIn: string, amOut: string, pmIn: string, pmOut: string } => {
  let amIn = "", amOut = "", pmIn = "", pmOut = "";
  
  checkIns.sort();
  checkOuts.sort();

  if (checkIns.length === 2 && checkOuts.length === 2) {
    if (isAMTime(checkIns[0])) {
      amIn = checkIns[0];
      amOut = checkOuts[0];
      pmIn = checkIns[1];
      pmOut = checkOuts[1];
    } else {
      pmIn = checkIns[0];
      pmOut = checkOuts[0];
      amIn = checkIns[1];
      amOut = checkOuts[1];
    }
  } else if (checkIns.length === 1 && checkOuts.length === 1) {
    if (isAMTime(checkIns[0])) {
      amIn = checkIns[0];
      amOut = checkOuts[0];
    } else {
      pmIn = checkIns[0];
      pmOut = checkOuts[0];
    }
  }

  return { amIn, amOut, pmIn, pmOut };
};

const Productivity: React.FC<ProductivityProps> = ({ userIdRef }) => {
  const [attendanceData, setAttendanceData] = useState<DataEntry[]>([]);
  const [rtdbUserId, setRtdbUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First, get the user data from Firestore
        const usersQuery = query(
          collection(db, "users"),
          where("userIdRef", "==", userIdRef)
        );
        const usersSnapshot = await getDocs(usersQuery);
        
        if (!usersSnapshot.empty) {
          const userData = usersSnapshot.docs[0].data() as FirestoreUser;
          
          // Then, get the RTDB user ID
          const rtdbUserRef = ref(rtdb, `users/${userIdRef}`);
          const rtdbUserSnapshot = await get(rtdbUserRef);
          
          if (rtdbUserSnapshot.exists()) {
            const rtdbUserData = rtdbUserSnapshot.val() as RTDBUser;
            setRtdbUserId(rtdbUserData.userid);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userIdRef) {
      fetchUserData();
    }
  }, [userIdRef]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!rtdbUserId) return;

      try {
        // Get the last 30 days
        const dates = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return format(date, 'yyyy-MM-dd');
        });

        const attendanceRecords: DataEntry[] = [];

        for (const date of dates) {
          const attendanceSnapshot = await get(ref(rtdb, `attendance/${date}/id_${rtdbUserId}`));
          const userAttendance = attendanceSnapshot.val() as Record<string, AttendanceEntry> | null;

          if (userAttendance) {
            const entries = Object.values(userAttendance);
            
            // Calculate regular hours from Check-in/Check-out
            const checkIns = entries.filter(entry => entry.type === "Check-in").map(entry => entry.time);
            const checkOuts = entries.filter(entry => entry.type === "Check-out").map(entry => entry.time);
            
            const { amIn, amOut, pmIn, pmOut } = assignTimeEntries(checkIns, checkOuts);
            
            let regularHours = 0;
            if (amIn && amOut) {
              regularHours += calculateTimeDifference(amIn, amOut);
            }
            if (pmIn && pmOut) {
              regularHours += calculateTimeDifference(pmIn, pmOut);
            }

            // Calculate overtime hours only from explicit Overtime entries
            const overtimeHours = entries.reduce((total, entry) => {
              if (entry.type === "Overtime-in") {
                const outEntry = entries.find(e => 
                  e.type === "Overtime-out" && e.time > entry.time
                );
                if (outEntry) {
                  return total + calculateTimeDifference(entry.time, outEntry.time);
                }
              }
              return total;
            }, 0);

            attendanceRecords.push({
              date,
              regularHours: Number(regularHours.toFixed(2)),  // Round to 2 decimal places
              overtimeHours: Number(overtimeHours.toFixed(2)) // Round to 2 decimal places
            });
          }
        }

        // Sort by date
        attendanceRecords.sort((a, b) => a.date.localeCompare(b.date));
        setAttendanceData(attendanceRecords);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [rtdbUserId]);

  const chartData: ChartData<"line"> = {
    labels: attendanceData.map((entry) => entry.date),
    datasets: [
      {
        label: "Regular Hours",
        data: attendanceData.map((entry) => entry.regularHours),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 1,
        fill: true,
      },
      {
        label: "Overtime Hours",
        data: attendanceData.map((entry) => entry.overtimeHours),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
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
        // Removed the max limit to allow regular hours to exceed 8
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y.toFixed(2);
            return `${label}: ${value} hours`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 col-span-full md:col-span-3 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-neutral dark:text-white">
        Work Hours Distribution
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Productivity;