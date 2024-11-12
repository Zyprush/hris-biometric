"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { db, rtdb } from "@/firebase";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { toast } from "react-toastify";
import { BsSearch } from "react-icons/bs";
import Modal from "./components/payrollModal"; // You'll need to create this component
import PayslipContent from "./components/payslip"; // You'll need to create this component
import { get, ref } from "firebase/database";
import PrintPayslips from "./components/printPaySlipComponent";
import { AttendanceEntry, Employee } from "./components/types";


const Payroll: React.FC = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAvailableMonths();
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchEmployees(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchAvailableMonths = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "payroll"));
      const months = querySnapshot.docs.map(doc => doc.id).sort((a, b) => b.localeCompare(a));
      setAvailableMonths(months);

      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

      if (!months.includes(currentMonth)) {
        months.unshift(currentMonth);
      }

      setSelectedMonth(currentMonth);
    } catch (error) {
      console.error("Error fetching available months: ", error);
      toast.error("Failed to fetch available months");
    }
  };

  const calculateDaysOfWork = async (rtdbUserId: string) => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    let totalWorkDays = 0;

    const calculateHoursBetween = (checkIn: string, checkOut: string) => {
      const [inHours, inMinutes] = checkIn.split(':').map(Number);
      const [outHours, outMinutes] = checkOut.split(':').map(Number);

      const checkInDate = new Date();
      checkInDate.setHours(inHours, inMinutes, 0);

      const checkOutDate = new Date();
      checkOutDate.setHours(outHours, outMinutes, 0);

      // Handle cases where checkout is on the next day
      if (outHours < inHours) {
        checkOutDate.setDate(checkOutDate.getDate() + 1);
      }

      const diffMs = checkOutDate.getTime() - checkInDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      return diffHours;
    };

    // Include today in the loop by adding 1 to today's date
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 1);

    for (let day = firstDayOfMonth; day < endDate; day.setDate(day.getDate() + 1)) {
      const dateString = day.toISOString().split('T')[0];
      const attendanceRef = ref(rtdb, `attendance/${dateString}/id_${rtdbUserId}`);
      const attendanceSnapshot = await get(attendanceRef);

      if (attendanceSnapshot.exists()) {
        const entries = Object.values(attendanceSnapshot.val())
          .sort((a: any, b: any) => a.time.localeCompare(b.time));

        let dailyHours = 0;
        let lastCheckIn: string | null = null;

        // Process each entry pair (check-in/check-out)
        entries.forEach((entry: any) => {
          if (entry.type === "Check-in") {
            lastCheckIn = entry.time;
          } else if (entry.type === "Check-out" && lastCheckIn) {
            // Calculate hours between this pair
            const hoursWorked = calculateHoursBetween(lastCheckIn, entry.time);
            dailyHours += hoursWorked;
            lastCheckIn = null;
          }
        });

        // For today's incomplete entries (if there's a check-in without check-out)
        if (dateString === today.toISOString().split('T')[0] && lastCheckIn) {
          const currentTime = new Date();
          const currentTimeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
          const hoursWorked = calculateHoursBetween(lastCheckIn, currentTimeString);
          dailyHours += hoursWorked;
        }

        // Convert hours to days (8 hours = 1 day)
        if (dailyHours >= 8) {
          totalWorkDays += 1;
        } else if (dailyHours > 0) {
          totalWorkDays += dailyHours / 8;
        }
      }
    }

    return Number(totalWorkDays.toFixed(2));
  };

  const calculateOvertimeHours = (entries: AttendanceEntry[]): number => {
    let totalOvertimeHours = 0;
    let overtimeStart: Date | null = null;
    let overtimeEnd: Date | null = null;

    //console.log("Calculating overtime hours for entries:", entries);

    // Sort entries by time to ensure correct order
    entries.sort((a, b) => a.time.localeCompare(b.time));

    entries.forEach((entry) => {
      const [hours, minutes, seconds] = entry.time.split(':').map(Number);
      const entryTime = new Date();
      entryTime.setHours(hours, minutes, seconds);

      //console.log(`Processing entry: ${entry.type} at ${entry.time}`);

      if (entry.type === "Overtime-in") {
        //console.log("Overtime-in detected:", entry.time);
        overtimeStart = entryTime;
      } else if (entry.type === "Overtime-out") {
        //console.log("Overtime-out detected:", entry.time);
        overtimeEnd = entryTime;
      }

      // Calculate overtime if we have both start and end
      if (overtimeStart && overtimeEnd) {
        const overtimeDuration = (overtimeEnd.getTime() - overtimeStart.getTime()) / (1000 * 60 * 60);
        //console.log("Calculated overtime duration:", overtimeDuration.toFixed(2), "hours");
        totalOvertimeHours += overtimeDuration;

        // Reset for next potential overtime period
        overtimeStart = null;
        overtimeEnd = null;
      }
    });

    // Handle case where there's an Overtime-in without a corresponding Overtime-out
    if (overtimeStart && !overtimeEnd) {
      console.warn("Overtime-in without corresponding Overtime-out detected. Ignoring this period.");
    }

    //console.log("Total overtime hours calculated:", totalOvertimeHours.toFixed(2));
    return totalOvertimeHours;
  };

  const fetchEmployees = async (month: string) => {
    setIsLoading(true);
    try {
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;

      if (month === currentMonth) {
        // Fetch and calculate current month's data
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedEmployees: Employee[] = await Promise.all(
          querySnapshot.docs
            .filter((doc) => doc.data().name !== "Admin")
            .map(async (doc: QueryDocumentSnapshot<DocumentData>) => {
              const data = doc.data();
              const userIdRef = data.userIdRef;

              let daysOfWork = 0;
              let overtimeHours = 0;
              let userId = "";
              if (userIdRef) {
                try {
                  const userRef = ref(rtdb, `users/${userIdRef}`);
                  const userSnapshot = await get(userRef);
                  const userData = userSnapshot.val();
                  if (userData && userData.userid) {
                    userId = userData.userid;
                    daysOfWork = await calculateDaysOfWork(userId);

                    // Calculate overtime
                    const today = new Date();
                    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    for (let day = firstDayOfMonth; day <= today; day.setDate(day.getDate() + 1)) {
                      const dateString = day.toISOString().split('T')[0];
                      const attendanceRef = ref(rtdb, `attendance/${dateString}/id_${userId}`);
                      const attendanceSnapshot = await get(attendanceRef);

                      if (attendanceSnapshot.exists()) {
                        const entries: AttendanceEntry[] = Object.values(attendanceSnapshot.val());
                        //console.log(`Attendance entries for ${dateString}:`, entries);
                        const dailyOvertimeHours = calculateOvertimeHours(entries);
                        //console.log(`Overtime hours for ${dateString}:`, dailyOvertimeHours.toFixed(2));
                        overtimeHours += dailyOvertimeHours;
                      }
                    }
                  }
                } catch (error) {
                  console.error(`Error fetching RTDB data for user ${data.name} (ID: ${doc.id}):`, error);
                }
              }

              const rate = data.rate || 520; // Fixed rate
              const hourlyRate = rate / 8; // Assuming 8-hour workday
              //const daysOfWork = await calculateDaysOfWork(userId);
              const overtimePay = overtimeHours * (hourlyRate * 2); // Overtime pay is 2x hourly rate
              const holiday = data.holiday || 0;

              const totalRegularWage = rate * Math.floor(daysOfWork) +
                (hourlyRate * 8 * (daysOfWork % 1));
              const totalAmount = totalRegularWage + overtimePay + holiday;

              const sssDeduction = data.sssDeduction || 0;
              const philhealthDeduction = data.philhealthDeduction || 0;
              const pagibigDeduction = data.pagibigDeduction || 0;
              const cashAdvance = data.cashAdvance || 0;

              const totalDeductions = sssDeduction + philhealthDeduction + pagibigDeduction + cashAdvance;

              return {
                id: userId,
                name: data.name || "",
                rate,
                daysOfWork,
                totalRegularWage,
                overtime: overtimePay,
                overtimeHours,
                holiday,
                totalAmount,
                sssDeduction,
                philhealthDeduction,
                pagibigDeduction,
                cashAdvance,
                totalDeductions,
                totalNetAmount: totalAmount - totalDeductions,
              };
            })
        );

        // Save current month's data
        const payrollData = fetchedEmployees.reduce((acc, employee) => {
          acc[employee.id] = employee;
          return acc;
        }, {} as Record<string, Employee>);

        await setDoc(doc(db, "payroll", currentMonth), payrollData);

        setEmployees(fetchedEmployees);
        setFilteredEmployees(fetchedEmployees);
      } else {
        // Fetch historical data
        const payrollRef = doc(db, "payroll", month);
        const payrollSnapshot = await getDoc(payrollRef);

        if (payrollSnapshot.exists()) {
          const historicalData = payrollSnapshot.data();
          const historicalEmployees: Employee[] = Object.values(historicalData);

          setEmployees(historicalEmployees);
          setFilteredEmployees(historicalEmployees);
        } else {
          console.warn(`No payroll data found for ${month}`);
          setEmployees([]);
          setFilteredEmployees([]);
        }
      }
    } catch (error) {
      console.error("Error fetching employees: ", error);
      toast.error("Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = employees.filter(
      (employee: Employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleRowClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (employeeId: string) => {
    setSelectedEmployees(prev => {
      const newSelected = prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId];
      setSelectAll(newSelected.length === currentItems.length);
      return newSelected;
    });
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSelectAll(isChecked);
    if (isChecked) {
      setSelectedEmployees(currentItems.map(emp => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };


  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`btn bg-primary text-white btn-sm rounded-lg px-4 ${currentPage === i
            ? "bg-primary text-white"
            : "bg-gray-200 text-gray-700"
            }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };


  return (
    <AdminRouteGuard>
      <div className="container mx-auto p-4 h-full">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="select select-sm select-bordered rounded-sm w-full sm:w-64"
            >
              {availableMonths.map((month) => (
                <option key={month} value={month}>
                  {new Date(month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="input input-sm input-bordered rounded-sm w-full sm:w-64"
            />
            <div className="flex w-full sm:flex-1 space-x-2">
              <button
                onClick={handleSearch}
                className="btn rounded-md btn-sm btn-primary text-white flex-1 sm:flex-none"
              >
                <BsSearch className="text-xs sm:text-sm" />
              </button>
              <PrintPayslips
                employees={employees.filter(emp => selectedEmployees.includes(emp.id))}
              />
            </div>
          </div>
          <div className="overflow-x-auto rounded-sm">
            <table className="table-auto rounded-sm border">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                      className="checkbox checkbox-sm border-zinc-300"
                    />
                  </th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Name of Employee</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Rate</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Days of Works</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Total Regular Wage</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Overtime</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Holiday</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Total Amount</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" colSpan={4}>Deduction</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Total Deductions</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs" rowSpan={2}>Total Net Amount</th>
                </tr>
                <tr>
                  <th className="border border-gray-500 px-2 py-1 text-xs">SSS</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs">PHILHEALTH</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs">PAGIBIG</th>
                  <th className="border border-gray-500 px-2 py-1 text-xs">Cash Advance</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {isLoading ? (
                  <tr>
                    <td colSpan={14} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                ) : currentItems.length < 1 ? (
                  <tr>
                    <td colSpan={14} className="text-red-500 text-xs border border-gray-300 px-2 py-1">
                      No results
                    </td>
                  </tr>
                ) : (
                  currentItems.map((employee: Employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-gray-100 cursor-pointer border border-gray-500 dark:text-zinc-200 dark:bg-gray-800 dark:hover:bg-gray-900 "
                      onClick={() => handleRowClick(employee)}
                    >
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">
                        <input
                          type="checkbox"
                          checked={selectedEmployees.includes(employee.id)}
                          onChange={() => handleCheckboxChange(employee.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="checkbox checkbox-sm dark:border-zinc-300"
                        />
                      </td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.name}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.rate.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.daysOfWork}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.totalRegularWage.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.overtime.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.holiday.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.totalAmount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.sssDeduction.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.philhealthDeduction.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.pagibigDeduction.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.cashAdvance.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.totalDeductions.toFixed(2)}</td>
                      <td className="px-4 py-2 text-xs border border-b dark:border-gray-500">{employee.totalNetAmount.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {filteredEmployees.length > itemsPerPage && (
              <div className="flex justify-between items-center mt-4">
                <button
                  className={`px-4 bg-primary text-white rounded-lg btn-sm text-sm ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <div>{renderPageNumbers()}</div>
                <button
                  className={`px-4 bg-primary text-white rounded-lg btn-sm text-sm ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {selectedEmployee && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <PayslipContent employee={selectedEmployee} />
        </Modal>
      )}
    </AdminRouteGuard>
  );
};

export default Payroll