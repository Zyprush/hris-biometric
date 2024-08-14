import { ref, get } from 'firebase/database';
import { rtdb } from '@/firebase';
import { Attendee, AttendeeRecord } from './types';

export const fetchAttendees = async (date: string): Promise<Attendee[]> => {
  const dateRef = ref(rtdb, `attendance/${date}`);
  const snapshot = await get(dateRef);
  
  if (snapshot.exists()) {
    const attendeesMap: { [key: string]: Attendee } = {};

    snapshot.forEach(childSnapshot => {
      childSnapshot.forEach(grandChildSnapshot => {
        const record: AttendeeRecord = grandChildSnapshot.val();
        const time = formatTime(record.time);

        if (!attendeesMap[record.id]) {
          attendeesMap[record.id] = { id: record.id, name: record.name };
        }

        const attendee = attendeesMap[record.id];
        
        switch (record.type) {
          case 'Check-in':
            if (!attendee.timeIn || (attendee.timeIn > time)) {
              attendee.timeIn = time;
            }
            break;
          case 'Check-out':
            if (!attendee.timeOut || (attendee.timeOut < time)) {
              attendee.timeOut = time;
            }
            break;
          case 'Overtime-in':
            if (!attendee.overtimeIn || (attendee.overtimeIn > time)) {
              attendee.overtimeIn = time;
            }
            break;
          case 'Overtime-out':
            if (!attendee.overtimeOut || (attendee.overtimeOut < time)) {
              attendee.overtimeOut = time;
            }
            break;
        }
      });
    });

    return Object.values(attendeesMap);
  } else {
    return [];
  }
};

export const formatTime = (timeStr: string): string => {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, seconds);

  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  return date.toLocaleTimeString([], options);
};

export const fetchDatesWithAttendance = async (year: number, month: number): Promise<string[]> => {
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;
  
  const attendanceRef = ref(rtdb, 'attendance');
  const snapshot = await get(attendanceRef);
  
  const datesWithAttendance: string[] = [];
  
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const date = childSnapshot.key;
      if (date && date >= startDate && date <= endDate) {
        datesWithAttendance.push(date);
      }
    });
  }
  
  return datesWithAttendance;
};