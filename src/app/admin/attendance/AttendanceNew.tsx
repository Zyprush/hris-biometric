"use client";

import React, { useState, useEffect } from "react";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { differenceInMinutes, format, parseISO } from "date-fns";
import { collection, getDocs, query, where, DocumentData } from "firebase/firestore";
import { ref, get, DataSnapshot } from "firebase/database";
import { db, rtdb } from "@/firebase";
import AttendanceTable from "./AttendanceTable";
import AttendanceFilters from "./AttendanceFilter";

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

interface AttendanceEntry {
  id: string;
  name: string;
  state: string;
  time: string;
  type: string;
}

const Attendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const formatTo12Hour = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes}`;
  };

  const calculateTimeDifference = (start: string, end: string): number => {
    const startDate = parseISO(`2000-01-01T${start}`);
    const endDate = parseISO(`2000-01-01T${end}`);
    return differenceInMinutes(endDate, startDate);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch departments
        const departmentsSnapshot = await getDocs(collection(db, "departments"));
        const departmentsList = departmentsSnapshot.docs.map(doc => doc.data().name as string);
        setDepartments(["All", ...departmentsList]);

        // Fetch non-admin users
        const usersQuery = query(
          collection(db, "users"),
          where("role", "!=", "admin")
        );

        const usersSnapshot = await getDocs(usersQuery);
        const users: FirestoreUser[] = usersSnapshot.docs.map(doc => ({
          employeeId: doc.data().employeeId,
          name: doc.data().name,
          department: doc.data().department,
          userIdRef: doc.data().userIdRef
        }));

        // Match Firestore users with RTDB users
        const matchedUsers = await Promise.all(users.map(async (user) => {
          const userRef = ref(rtdb, `users/${user.userIdRef}`);
          const userSnapshot = await get(userRef);

          if (userSnapshot.exists()) {
            const rtdbUserData = userSnapshot.val() as RTDBUser;
            return {
              ...user,
              rtdbUserId: rtdbUserData.userid // Use the 'userid' from RTDB
            };
          } else {
            console.warn(`No matching RTDB user found for userIdRef: ${user.userIdRef}`);
            return {
              ...user,
              rtdbUserId: null
            };
          }
        }));

        // Fetch attendance data for each user
        const attendanceRecords: AttendanceRecord[] = [];

        for (const user of matchedUsers) {
          if (user.rtdbUserId) {
            const attendanceSnapshot = await get(ref(rtdb, `attendance/${fromDate}/id_${user.rtdbUserId}`));
            const userAttendance = attendanceSnapshot.val() as Record<string, AttendanceEntry> | null;

            if (userAttendance) {
              const attendanceEntries = Object.values(userAttendance);
              const checkIns = attendanceEntries.filter(entry => entry.type === "Check-in").map(entry => entry.time);
              const checkOuts = attendanceEntries.filter(entry => entry.type === "Check-out").map(entry => entry.time);
              const overtimeEntries = attendanceEntries.filter(entry => entry.type.startsWith("Overtime"));

              const amIn = checkIns[0] || "";
              const amOut = checkOuts[0] || "";
              const pmIn = checkIns[1] || "";
              const pmOut = checkOuts[1] || "";

              // Calculate total hours
              const amMinutes = calculateTimeDifference(amIn, amOut);
              const pmMinutes = calculateTimeDifference(pmIn, pmOut);
              const totalMinutes = amMinutes + pmMinutes;
              const totalHours = totalMinutes / 60;

              // Calculate OT hours
              const otHours = overtimeEntries.reduce((total, entry) => {
                if (entry.type === "Overtime-in") {
                  const outEntry = overtimeEntries.find(e => e.type === "Overtime-out" && e.time > entry.time);
                  if (outEntry) {
                    const otMinutes = calculateTimeDifference(entry.time, outEntry.time);
                    return total + otMinutes / 60;
                  }
                }
                return total;
              }, 0);

              // Calculate undertime
              const underTime = Math.max(8 - totalHours, 0);

              attendanceRecords.push({
                date: fromDate,
                employeeId: user.employeeId,
                employeeName: user.name,
                department: user.department,
                amIn: formatTo12Hour(amIn) + " AM",
                amOut: formatTo12Hour(amOut) + " AM",
                pmIn: formatTo12Hour(pmIn) + " PM",
                pmOut: formatTo12Hour(pmOut) + " PM",
                otHours: otHours.toFixed(2),
                underTime: underTime.toFixed(2),
                totalHours: totalHours.toFixed(2)
              });
            }
          }
        }
        setAttendanceData(attendanceRecords);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    };

    if (fromDate) {
      fetchData();
    }
  }, [fromDate]);

  useEffect(() => {
    // Set initial date range to today
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");
    setFromDate(formattedDate);
    setToDate(formattedDate);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.target.value);
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
  };

  const filteredData = attendanceData.filter((record) => {
    const isWithinDateRange =
      (!fromDate || record.date >= fromDate) && (!toDate || record.date <= toDate);
    const matchesSearchTerm =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || record.department === selectedDepartment;

    return isWithinDateRange && matchesSearchTerm && matchesDepartment;
  });

  return (
    <AdminRouteGuard>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Attendance</h2>

        <AttendanceFilters
          fromDate={fromDate}
          toDate={toDate}
          searchTerm={searchTerm}
          selectedDepartment={selectedDepartment}
          departments={departments}
          onFromDateChange={handleFromDateChange}
          onToDateChange={handleToDateChange}
          onSearchChange={handleSearch}
          onDepartmentChange={handleDepartmentChange}
        />

        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <AttendanceTable data={filteredData} />
        )}
      </div>
    </AdminRouteGuard>
  );
};

export default Attendance;