import { getDatabase, ref, get, child } from "firebase/database";
import { differenceInMinutes, format, parse } from "date-fns";

interface AttendanceRecord {
  time: string;
  type: string;
}

export const getOvertimeData = async (userId: string): Promise<{ date: string; hours: number }[]> => {
  const db = getDatabase();
  const attendanceRef = ref(db, "attendance");
  const today = new Date();
  const dates = Array.from({ length: 10 }, (_, i) => format(today.setDate(today.getDate() - i), "yyyy-MM-dd"));

  const overtimeData: { date: string; hours: number }[] = [];

  for (const date of dates) {
    const snapshot = await get(child(attendanceRef, `${date}/id_${userId}`));
    if (snapshot.exists()) {
      const records: Record<string, AttendanceRecord> = snapshot.val();
      let lastCheckOut: string | null = null;
      let overtimeIn: string | null = null;
      let overtimeOut: string | null = null;

      Object.values(records).forEach((record) => {
        if (record.type === "Check-out") {
          lastCheckOut = record.time;
        } else if (record.type === "Overtime-in") {
          overtimeIn = record.time;
        } else if (record.type === "Overtime-out") {
          overtimeOut = record.time;
        }
      });

      if (!overtimeIn && lastCheckOut) {
        overtimeIn = lastCheckOut;
      }

      if (overtimeIn && overtimeOut) {
        const start = parse(overtimeIn, "HH:mm:ss", new Date());
        const end = parse(overtimeOut, "HH:mm:ss", new Date());
        const overtimeMinutes = differenceInMinutes(end, start);
        overtimeData.push({ date, hours: overtimeMinutes / 60 });
      } else {
        overtimeData.push({ date, hours: 0 });
      }
    } else {
      overtimeData.push({ date, hours: 0 });
    }
  }

  return overtimeData.reverse(); // Reverse to have the oldest date first
};
