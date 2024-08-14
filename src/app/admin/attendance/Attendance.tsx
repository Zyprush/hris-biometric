import React, { useState, useEffect } from 'react';
import { AdminRouteGuard } from '@/components/AdminRouteGuard';
import { Holiday, Attendee } from './types';
import { fetchAttendees, fetchDatesWithAttendance } from './utils';
import AttendeeList from './AttendeeList';
import AttendanceCalendar from './AttendanceCalendar';
import AttendanceModal from './AttendanceModal';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';

const Attendance: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState<'calendar' | 'attendees'>('calendar');
  const [datesWithAttendance, setDatesWithAttendance] = useState<string[]>([]);

  useEffect(() => {
    fetchHolidays();
    fetchAttendanceDates();
  }, []);

  const fetchHolidays = async () => {
    const holidaysCollection = collection(db, 'holidays');
    const holidaySnapshot = await getDocs(holidaysCollection);
    const holidayList = holidaySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Holiday));
    setHolidays(holidayList);
  };
  const fetchAttendanceDates = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    const dates = await fetchDatesWithAttendance(year, month);
    setDatesWithAttendance(dates);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleAddHoliday = async (title: string) => {
    if (title && selectedDate) {
      const newHoliday: Holiday = {
        title,
        date: selectedDate,
        color: '#F44336'
      };
      try {
        const holidaysCollection = collection(db, 'holidays');
        await addDoc(holidaysCollection, newHoliday);
        await fetchHolidays();
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
    setShowModal(false);
  };

  const handleViewAttendees = async () => {
    if (selectedDate) {
      const fetchedAttendees = await fetchAttendees(selectedDate);
      setAttendees(fetchedAttendees);
      setView('attendees');
    }
    setShowModal(false);
  };

  const handleDeleteHoliday = async (holidayId: string) => {
    try {
      await deleteDoc(doc(db, 'holidays', holidayId));
      await fetchHolidays(); // Refresh the holidays list
      setShowModal(false); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting holiday: ", error);
    }
  };

  const handleBackToCalendar = () => {
    setView('calendar');
  };

  return (
    <AdminRouteGuard>
      <div className="w-full h-screen p-4">
        {view === 'calendar' ? (
          <AttendanceCalendar
            holidays={holidays}
            datesWithAttendance={datesWithAttendance}
            onDateSelect={handleDateSelect}
          />
        ) : (
          <AttendeeList
            attendees={attendees}
            selectedDate={selectedDate}
            onBackToCalendar={handleBackToCalendar}
          />
        )}
        {showModal && (
          <AttendanceModal
            selectedDate={selectedDate}
            holidays={holidays}
            onClose={() => setShowModal(false)}
            onViewAttendees={handleViewAttendees}
            onAddHoliday={handleAddHoliday}
            onDeleteHoliday={handleDeleteHoliday}
          />
        )}
      </div>
    </AdminRouteGuard>
  );
};

export default Attendance;