"use client";

import React, { useState, useEffect } from "react";
import { differenceInMinutes, eachDayOfInterval, format, parseISO } from "date-fns";
import { doc, getDoc } from "firebase/firestore";
import { ref, get } from "firebase/database";
import { db, rtdb } from "@/firebase";
import AttendanceTable from "@/app/admin/attendance/AttendanceTable";
import { UserRouteGuard } from "@/components/UserRouteGuard";

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

const AttendanceUser: React.FC<{ userId?: string }> = ({ userId }) => {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
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

    // Sort times chronologically
    checkIns.sort();
    checkOuts.sort();

    if (checkIns.length === 2 && checkOuts.length === 2) {
      // Full day scenario with 2 check-ins and 2 check-outs
      const firstCheckIn = checkIns[0];
      const secondCheckIn = checkIns[1];
      const firstCheckOut = checkOuts[0];
      const secondCheckOut = checkOuts[1];

      if (isAMTime(firstCheckIn)) {
        amIn = firstCheckIn;
        amOut = firstCheckOut;
        pmIn = secondCheckIn;
        pmOut = secondCheckOut;
      } else {
        pmIn = firstCheckIn;
        pmOut = firstCheckOut;
        amIn = secondCheckIn;
        amOut = secondCheckOut;
      }
    } else if (checkIns.length === 1 && checkOuts.length === 1) {
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

  const fetchAttendanceForDate = async (date: string, user: FirestoreUser & { rtdbUserId: string }) => {
    const attendanceSnapshot = await get(ref(rtdb, `attendance/${date}/id_${user.rtdbUserId}`));
    const userAttendance = attendanceSnapshot.val() as Record<string, AttendanceEntry> | null;

    if (!userAttendance) return null;

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

    return {
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
    };
  };

  const fetchUserData = async (userId: string) => {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) throw new Error("User not found");

    const userData = userDoc.data() as FirestoreUser;
    const rtdbUserRef = ref(rtdb, `users/${userData.userIdRef}`);
    const rtdbUserSnapshot = await get(rtdbUserRef);
    
    if (!rtdbUserSnapshot.exists()) throw new Error("RTDB user not found");

    const rtdbUserData = rtdbUserSnapshot.val() as RTDBUser;
    
    return {
      ...userData,
      rtdbUserId: rtdbUserData.userid
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!fromDate || !toDate || !userId) return;
      
      setIsLoading(true);
      try {
        const user = await fetchUserData(userId);
        const dateRange = eachDayOfInterval({
          start: parseISO(fromDate),
          end: parseISO(toDate)
        });

        const attendancePromises = dateRange.map(date => 
          fetchAttendanceForDate(format(date, 'yyyy-MM-dd'), user)
        );

        const records = await Promise.all(attendancePromises);
        setAttendanceData(records.filter((record): record is AttendanceRecord => record !== null));
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, userId]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");
    setFromDate(formattedDate);
    setToDate(formattedDate);
  }, []);

  return (
    <UserRouteGuard>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Attendance</h2>

        <div className="flex gap-4 mb-4">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <AttendanceTable data={attendanceData} />
        )}
      </div>
    </UserRouteGuard>
  );
};

export default AttendanceUser;