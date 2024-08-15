import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/core';
import { Holiday } from './types';

interface DateWithAttendanceCount {
    date: string;
    count: number;
  }
interface AttendanceCalendarProps {
    holidays: Holiday[];
    datesWithAttendance: DateWithAttendanceCount[];
    onDateSelect: (date: string) => void;
  }
  
  const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({ 
    holidays, 
    datesWithAttendance, 
    onDateSelect
  }) => {
    const handleDateSelect = (selectInfo: DateSelectArg) => {
      onDateSelect(selectInfo.startStr);
    };
  
    const events: EventInput[] = [
        ...holidays.map(holiday => ({
          id: holiday.id,
          title: holiday.title,
          date: holiday.date,
          color: holiday.color,
          source: { id: 'holidays' }
        })),
        ...datesWithAttendance.map(({ date, count }) => ({
          title: `Total Attendees: ${count}`,
          date,
          color: '#4CAF50',
          source: { id: 'attendance' }
        }))
      ];

    return (
        <div className="bg-white rounded-lg shadow-md p-4 h-[calc(100%-5rem)]">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                selectable={true}
                select={handleDateSelect}
                height="100%"

            />
        </div>
    );
};

export default AttendanceCalendar;