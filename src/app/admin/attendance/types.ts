export interface Holiday {
    id?: string;
    title: string;
    date: string;
    color: string;
  }
  
  export interface AttendeeRecord {
    id: string;
    name: string;
    time: string;
    type: string;
  }
  
  export interface Attendee {
    id: string;
    name: string;
    timeIn?: string;
    timeOut?: string;
    overtimeIn?: string;
    overtimeOut?: string;
  }