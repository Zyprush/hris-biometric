import { getDatabase, ref, get, child } from "firebase/database";
import { format } from "date-fns";

interface AttendanceRecord {
  time: string;
  type: string;
}

export const getWorkHours = async (userId: string): Promise<{ date: string; hours: number }[]> => {
  const db = getDatabase();
  const attendanceRef = ref(db, "attendance");
  const today = new Date();
  const dates = Array.from({ length: 10 }, (_, i) => format(today.setDate(today.getDate() - i), "yyyy-MM-dd"));

  const workHoursData: { date: string; hours: number }[] = [];

  for (const date of dates) {
    const snapshot = await get(child(attendanceRef, `${date}/id_${userId}`));
    if (snapshot.exists()) {
      const records: Record<string, AttendanceRecord> = snapshot.val();
      let checkInCount = 0;
      let checkOutCount = 0;

      Object.values(records).forEach((record) => {
        if (record.type === "Check-in") {
          checkInCount++;
        } else if (record.type === "Check-out") {
          checkOutCount++;
        }
      });

      if (checkInCount >= 2 && checkOutCount >= 2) {
        workHoursData.push({ date, hours: 8 });
      } else if (checkInCount >= 1 && checkOutCount >= 1) {
        workHoursData.push({ date, hours: 4 });
      } else {
        workHoursData.push({ date, hours: 0 });
      }
    } else {
      workHoursData.push({ date, hours: 0 });
    }
  }

  return workHoursData.reverse(); // Reverse to have the oldest date first
};
