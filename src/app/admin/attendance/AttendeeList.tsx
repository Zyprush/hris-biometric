import React from 'react';
import { Attendee } from './types';

interface AttendeeListProps {
  attendees: Attendee[];
  selectedDate: string | null;
  onBackToCalendar: () => void;
}

const AttendeeList: React.FC<AttendeeListProps> = ({ attendees, selectedDate, onBackToCalendar }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[calc(100%-5rem)]">
      <button
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
        onClick={onBackToCalendar}
      >
        Back to Calendar
      </button>
      <h2 className="text-xl font-bold mb-4">Attendees for {selectedDate}</h2>
      {attendees.length > 0 ? (
        <ul>
          {attendees.map((attendee) => (
            <li key={attendee.id} className="mb-2">
              <span className="font-semibold">{attendee.name}</span>:<br />
              Time-in: {attendee.timeIn || 'N/A'}<br />
              Time-out: {attendee.timeOut || 'N/A'}<br />
              Overtime-in: {attendee.overtimeIn || 'N/A'}<br />
              Overtime-out: {attendee.overtimeOut || 'N/A'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No attendees found for this date.</p>
      )}
    </div>
  );
};

export default AttendeeList;