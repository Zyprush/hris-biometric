"use client";

import React, { useState, useEffect } from "react";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { differenceInMinutes, eachDayOfInterval, format, parseISO } from "date-fns";
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
    if (!time) return "N/A";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const calculateTimeDifference = (start: string, end: string): number => {
    const startDate = parseISO(`2000-01-01T${start}`);
    const endDate = parseISO(`2000-01-01T${end}`);
    return differenceInMinutes(endDate, startDate);
  };

  // Helper function to determine if a time is AM or PM
  const isAMTime = (time: string): boolean => {
    if (!time) return false;
    const [hours] = time.split(':');
    const hour = parseInt(hours, 10);
    // Consider times between 5:00 and 12:59 as AM
    return hour >= 5 && hour < 13;
  };

  // Helper function to determine if a time difference suggests missing middle entries
  const hasLargeTimeDifference = (checkIn: string, checkOut: string): boolean => {
    if (!checkIn || !checkOut) return false;
    const startDate = parseISO(`2000-01-01T${checkIn}`);
    const endDate = parseISO(`2000-01-01T${checkOut}`);
    const diffInHours = differenceInMinutes(endDate, startDate) / 60;
    // If difference is more than 5 hours, likely missing middle entries
    return diffInHours > 5;
  };

  const assignTimeEntries = (checkIns: string[], checkOuts: string[]): { amIn: string, amOut: string, pmIn: string, pmOut: string } => {
    let amIn = "", amOut = "", pmIn = "", pmOut = "";

    // If more than 4 total entries, we'll reduce to most relevant entries
  if (checkIns.length > 2 || checkOuts.length > 2) {
    console.warn(`Unusual number of check-ins (${checkIns.length}) or check-outs (${checkOuts.length})`);
    
    // Sort all entries chronologically
    const sortedCheckIns = [...checkIns].sort();
    const sortedCheckOuts = [...checkOuts].sort();

    // Take the earliest and latest entries for each period
    const earlyAMCheckIns = sortedCheckIns.filter(time => isAMTime(time));
    const lateAMCheckOuts = sortedCheckOuts.filter(time => isAMTime(time));
    const earlyPMCheckIns = sortedCheckIns.filter(time => !isAMTime(time));
    const latePMCheckOuts = sortedCheckOuts.filter(time => !isAMTime(time));

    // Select the most relevant entries
    amIn = earlyAMCheckIns.length > 0 ? earlyAMCheckIns[0] : "";
    amOut = lateAMCheckOuts.length > 0 ? lateAMCheckOuts[lateAMCheckOuts.length - 1] : "";
    pmIn = earlyPMCheckIns.length > 0 ? earlyPMCheckIns[0] : "";
    pmOut = latePMCheckOuts.length > 0 ? latePMCheckOuts[latePMCheckOuts.length - 1] : "";
  } else  if (checkIns.length === 1 && checkOuts.length === 1) {
      const checkIn = checkIns[0];
      const checkOut = checkOuts[0];

      if (isAMTime(checkIn)) {
        // Check if there's a large time gap suggesting missing middle entries
        if (hasLargeTimeDifference(checkIn, checkOut)) {
          // Case where employee checked in AM and checked out PM, missing middle entries
          amIn = checkIn;
          pmOut = checkOut;
        } else {
          // Normal half-day morning scenario
          amIn = checkIn;
          amOut = checkOut;
        }
      } else {
        // Afternoon half-day
        pmIn = checkIn;
        pmOut = checkOut;
      }
    } else if (checkIns.length === 2 && checkOuts.length === 1) {
      // Special case: 2 check-ins but only 1 check-out
      const firstCheckIn = checkIns[0];
      const secondCheckIn = checkIns[1];
      const checkOut = checkOuts[0];

      if (isAMTime(firstCheckIn)) {
        amIn = firstCheckIn;
        if (isAMTime(secondCheckIn)) {
          amOut = checkOut;
        } else {
          pmIn = secondCheckIn;
          pmOut = checkOut;
        }
      } else {
        pmIn = firstCheckIn;
        if (isAMTime(secondCheckIn)) {
          amIn = secondCheckIn;
          amOut = checkOut;
        } else {
          pmOut = checkOut;
        }
      }
    } else if (checkIns.length === 1 && checkOuts.length === 0) {
      const checkIn = checkIns[0];
      
      if (isAMTime(checkIn)) {
        // Morning check-in only
        amIn = checkIn;
      } else {
        // Afternoon check-in only
        pmIn = checkIn;
      }
    } else if (checkIns.length === 2 && checkOuts.length === 0) {
      // Special case: 2 check-ins but no check-outs
      const firstCheckIn = checkIns[0];
      const secondCheckIn = checkIns[1];
      if (isAMTime(firstCheckIn)) {
        amIn = firstCheckIn;
        pmIn = secondCheckIn;
      } else {
        pmIn = firstCheckIn;
        amIn = secondCheckIn;
      }
    }
    
    return { amIn, amOut, pmIn, pmOut };
  };

  const fetchAttendanceForDate = async (date: string, users: Array<FirestoreUser & { rtdbUserId: string | null }>) => {
    const dateRecords: AttendanceRecord[] = [];

    for (const user of users) {
      if (user.rtdbUserId) {
        const attendanceSnapshot = await get(ref(rtdb, `attendance/${date}/id_${user.rtdbUserId}`));
        const userAttendance = attendanceSnapshot.val() as Record<string, AttendanceEntry> | null;

        if (userAttendance) {
          const attendanceEntries = Object.values(userAttendance);
          const checkIns = attendanceEntries.filter(entry => entry.type === "Check-in").map(entry => entry.time);
          const checkOuts = attendanceEntries.filter(entry => entry.type === "Check-out").map(entry => entry.time);
          const overtimeEntries = attendanceEntries.filter(entry => entry.type.startsWith("Overtime"));

          const { amIn, amOut, pmIn, pmOut } = assignTimeEntries(checkIns, checkOuts);

          const amMinutes = calculateTimeDifference(amIn, amOut);
          const pmMinutes = calculateTimeDifference(pmIn, pmOut);
          const totalMinutes = amMinutes + pmMinutes;
          const totalHours = totalMinutes / 60;

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

          const underTime = Math.max(8 - totalHours, 0);

          dateRecords.push({
            date,
            employeeId: user.employeeId,
            employeeName: user.name,
            department: user.department,
            amIn: formatTo12Hour(amIn),
            amOut: formatTo12Hour(amOut),
            pmIn: formatTo12Hour(pmIn),
            pmOut: formatTo12Hour(pmOut),
            otHours: otHours.toFixed(2),
            underTime: underTime.toFixed(2),
            totalHours: totalHours.toFixed(2)
          });
        }
      }
    }

    return dateRecords;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!fromDate || !toDate) return;
      
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
              rtdbUserId: rtdbUserData.userid
            };
          } else {
            console.warn(`No matching RTDB user found for userIdRef: ${user.userIdRef}`);
            return {
              ...user,
              rtdbUserId: null
            };
          }
        }));

        // Get all dates in the range
        const dateRange = eachDayOfInterval({
          start: parseISO(fromDate),
          end: parseISO(toDate)
        });

        // Fetch attendance for each date in parallel
        const allAttendanceRecords = await Promise.all(
          dateRange.map(date => 
            fetchAttendanceForDate(format(date, 'yyyy-MM-dd'), matchedUsers)
          )
        );

        // Flatten the array of arrays into a single array
        setAttendanceData(allAttendanceRecords.flat());

      } catch (error) {
        console.error("Error fetching attendance data:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fromDate, toDate]);

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

  const filteredData = attendanceData
  .filter((record) => {
    const isWithinDateRange =
      (!fromDate || record.date >= fromDate) && (!toDate || record.date <= toDate);
    const matchesSearchTerm =
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || record.department === selectedDepartment;

    return isWithinDateRange && matchesSearchTerm && matchesDepartment;
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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