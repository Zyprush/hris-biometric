export interface Employee {
  id: string;
  name: string;
  rate: number;
  daysOfWork: number;
  totalRegularWage: number;
  overtime: number;
  holiday: number;
  totalAmount: number;
  sssDeduction: number;
  philhealthDeduction: number;
  pagibigDeduction: number;
  cashAdvance: number;
  totalDeductions: number;
  totalNetAmount: number;
}

export interface AttendanceEntry {
  type: string;
  time: string;
}
