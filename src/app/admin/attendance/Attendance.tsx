import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';

const Attendance: React.FC = () => {
  const handleEventClick = (clickInfo: EventClickArg) => {
    alert(`Attendance for: ${clickInfo.event.title}`);
  };

  const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
    alert(`Date clicked: ${arg.date}`);
  };

  return (
    <div className="w-full h-screen p-4 bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-4 h-[calc(100%-5rem)]">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={[
            { title: 'Present', date: '2024-07-22', color: '#4CAF50' },
            { title: 'Absent', date: '2024-07-23', color: '#F44336' },
            { title: 'Late', date: '2024-07-24', color: '#FFC107' },
          ]}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="100%"
        />
      </div>
    </div>
  );
};

export default Attendance;