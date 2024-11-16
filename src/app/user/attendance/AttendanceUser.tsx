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
    if (!start || !end) return 0;
    const startDate = parseISO(`2000-01-01T${start}`);
    const endDate = parseISO(`2000-01-01T${end}`);
    return differenceInMinutes(endDate, startDate);
  };

  const isAMTime = (time: string): boolean => {
    if (!time) return false;
    const [hours] = time.split(':');
    const hour = parseInt(hours, 10);
    return hour >= 5 && hour < 13;
  };

  const hasLargeTimeDifference = (checkIn: string, checkOut: string): boolean => {
    if (!checkIn || !checkOut) return false;
    const diffInHours = calculateTimeDifference(checkIn, checkOut) / 60;
    return diffInHours > 5;
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
        if (hasLargeTimeDifference(checkIns[0], checkOuts[0])) {
          amIn = checkIns[0];
          pmOut = checkOuts[0];
        } else {
          amIn = checkIns[0];
          amOut = checkOuts[0];
        }
      } else {
        pmIn = checkIns[0];
        pmOut = checkOuts[0];
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