import { getDatabase, ref, get } from "firebase/database";
import { format } from "date-fns";

// Define the interface for an attendance event
interface AttendanceEvent {
  id: string;
  name: string;
  state: string;
  time: string;
  type: string;
}

export const isUserPresent = async (userId: string): Promise<boolean> => {
  const db = getDatabase();
  const currentDate = format(new Date(), "yyyy-MM-dd"); // Get the current date in 'YYYY-MM-DD' format
  const attendanceRef = ref(db, `attendance/${currentDate}/id_${userId}`);

  try {
    const snapshot = await get(attendanceRef);

    if (!snapshot.exists()) {
      return false; // No attendance data for the user today
    }

    const attendanceData: Record<string, AttendanceEvent> = snapshot.val();
    const events: AttendanceEvent[] = Object.values(attendanceData);

    // Find the last event
    const lastEvent = events.reduce((latest, event) => {
      return new Date(`${currentDate}T${event.time}`) > new Date(`${currentDate}T${latest.time}`)
        ? event
        : latest;
    });

    // Check if the last event is a "Check-in" and not a "Check-out"
    return lastEvent.type === "Check-in";
  } catch (error) {
    console.error("Error checking user attendance:", error);
    return false;
  }
};

// Usage example:
isUserPresent("3").then(isPresent => {
  console.log(isPresent ? "User is present" : "User is not present");
});
