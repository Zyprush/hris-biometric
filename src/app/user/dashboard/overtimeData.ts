import { ref, get, getDatabase } from "firebase/database";
import { format, subDays } from "date-fns";

interface AttendanceRecord {
  time: string;
  type: string;
}

interface DailyOvertime {
  date: string;
  overtimeHours: number;
}

export const fetchOvertimeHours = async (
  userId: string
): Promise<DailyOvertime[]> => {
  const overtimeData: DailyOvertime[] = [];
  const db = getDatabase();

  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
    const dayRef = ref(db, `attendance/${date}/id_${userId}`);
    const snapshot = await get(dayRef);

    if (snapshot.exists()) {
      const records: Record<string, AttendanceRecord> = snapshot.val();

      const checkInTimes: Date[] = [];
      let overtimeOut: Date | null = null;

      for (const recordKey in records) {
        const record = records[recordKey];
        //TODO: change this to "Overtime-in"
        if (record.type === "Check-in") {
          checkInTimes.push(new Date(`${date}T${record.time}`));
        } else if (record.type === "Overtime-out") {
          overtimeOut = new Date(`${date}T${record.time}`);
        }
      }

      if (overtimeOut && checkInTimes.length > 0) {
        const lastCheckIn = checkInTimes[checkInTimes.length - 1];
        const overtimeHours =
          (overtimeOut.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60);
        overtimeData.push({ date, overtimeHours });
      } else {
        overtimeData.push({ date, overtimeHours: 0 });
      }
    } else {
      overtimeData.push({ date, overtimeHours: 0 });
    }
  }

  return overtimeData;
};
