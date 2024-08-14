import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { db } from '@/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { AdminRouteGuard } from '@/components/AdminRouteGuard';

interface Holiday {
  id?: string;
  title: string;
  date: string;
  color: string;
}

interface Attendee {
  id?: string;
  name: string;
  date: string;
}

const Attendance: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    const holidaysCollection = collection(db, 'holidays');
    const holidaySnapshot = await getDocs(holidaysCollection);
    const holidayList = holidaySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Holiday));
    setHolidays(holidayList);
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.startStr);
    setShowModal(true);
  };

  const handleAddHoliday = async () => {
    const title = prompt('Enter holiday name:');
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

  const handleViewAttendees = () => {
    if (selectedDate) {
      // Navigate to the attendees view page
      // You'll need to implement this navigation logic
      console.log(`Viewing attendees for ${selectedDate}`);
    }
    setShowModal(false);
  };

  return (
    <AdminRouteGuard>
      <div className="w-full h-screen p-4">
        <div className="bg-white rounded-lg shadow-md p-4 h-[calc(100%-5rem)]">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={holidays}
            selectable={true}
            select={handleDateSelect}
            height="100%"
          />
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-4 rounded-lg">
              <h2 className="text-lg font-bold mb-4">{selectedDate}</h2>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleViewAttendees}
              >
                View Attendees
              </button>
              <button 
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleAddHoliday}
              >
                Add Holiday
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminRouteGuard>
  );
};

export default Attendance;