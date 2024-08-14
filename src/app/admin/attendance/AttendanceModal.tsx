import React, { useState } from 'react';
import { Holiday } from './types';

interface AttendanceModalProps {
  selectedDate: string | null;
  holidays: Holiday[];
  onClose: () => void;
  onViewAttendees: () => void;
  onAddHoliday: (title: string) => void;
  onDeleteHoliday: (holidayId: string) => void;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({
  selectedDate,
  holidays,
  onClose,
  onViewAttendees,
  onAddHoliday,
  onDeleteHoliday
}) => {
  const [holidayTitle, setHolidayTitle] = useState('');

  const handleAddHoliday = () => {
    if (holidayTitle.trim()) {
      onAddHoliday(holidayTitle);
      setHolidayTitle('');
    }
  };

  const holidaysOnSelectedDate = holidays.filter(holiday => holiday.date === selectedDate);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative p-8 w-full max-w-md m-auto flex-col flex rounded-lg bg-white dark:bg-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Attendance for {selectedDate}
        </h2>

        <button 
          onClick={onViewAttendees} 
          className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          View Attendees
        </button>

        <div className="mb-6">
          <input
            type="text"
            value={holidayTitle}
            onChange={(e) => setHolidayTitle(e.target.value)}
            placeholder="Enter holiday name"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button 
            onClick={handleAddHoliday} 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Add Holiday
          </button>
        </div>

        {holidaysOnSelectedDate.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Holidays on this date:</h3>
            {holidaysOnSelectedDate.map(holiday => (
              <div key={holiday.id} className="flex justify-between items-center mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <span className="text-gray-800 dark:text-white">{holiday.title}</span>
                <button 
                  onClick={() => onDeleteHoliday(holiday.id!)} 
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={onClose} 
          className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-300 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AttendanceModal;