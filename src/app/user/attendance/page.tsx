"use client";

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DateSelectArg } from '@fullcalendar/core';
import { db } from '@/firebase';
import { collection, addDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { UserRouteGuard } from '@/components/UserRouteGuard';
import { SignedIn } from '@/components/signed-in';
import UserLayout from '@/components/UserLayout';

interface Holiday {
  id?: string;
  title: string;
  date: string;
  color: string;
}
const Attendance = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    const holidaysCollection = collection(db, 'holidays');
    const holidaySnapshot = await getDocs(holidaysCollection);
    const holidayList = holidaySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Holiday));
    setHolidays(holidayList);
  };

  const handleEventClick = async (clickInfo: EventClickArg) => {
    {/**
      
      const confirmDelete = window.confirm(`Do you want to delete the holiday: ${clickInfo.event.title}?`);
      if (confirmDelete) {
        try {
          const holidaysCollection = collection(db, 'holidays');
          const q = query(holidaysCollection, where("title", "==", clickInfo.event.title));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
          });
          await fetchHolidays();
        } catch (error) {
          console.error("Error deleting document: ", error);
        }
      }
      */}
  };

  const handleDateSelect = async (selectInfo: DateSelectArg) => {
    {/**
      
      const title = prompt('Enter holiday name:');
      if (title) {
        const newHoliday: Holiday = {
          title,
          date: selectInfo.startStr,
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
      */}
  };

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
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
                events={holidays}
                eventClick={handleEventClick}
                selectable={true}
                select={handleDateSelect}
                height="100%"
              />
            </div>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};


export default Attendance;
