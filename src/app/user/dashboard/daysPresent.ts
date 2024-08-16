import { getDatabase, ref, query, orderByKey, startAt, endAt, get } from 'firebase/database';

async function getMonthlyAttendance(userId: string): Promise<Record<string, any>> {
  const db = getDatabase();
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;  // This will work for all months

  const attendanceRef = ref(db, 'attendance');
  const monthQuery = query(attendanceRef, orderByKey(), startAt(startDate), endAt(endDate));
  
  const snapshot = await get(monthQuery);
  return snapshot.val() || {};
}

function countDaysPresent(attendance: Record<string, any>, userId: string): number {
    const daysPresent = new Set<string>();
  
    for (const [date, users] of Object.entries(attendance)) {
      if (users[`id_${userId}`]) {
        daysPresent.add(date);
      }
    }
  
    return daysPresent.size;
  }

  export async function getTotalDaysPresent(userId: string): Promise<number> {
    try {
      const monthlyAttendance = await getMonthlyAttendance(userId);
      const totalDays = countDaysPresent(monthlyAttendance, userId);
      return totalDays;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      return 0;
    }
  }
