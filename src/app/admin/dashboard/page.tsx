"use client";

import React, { useEffect, useState } from 'react';
import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartData,
  ChartOptions
} from "chart.js";
import {
  FaUsers,
  FaUserMinus,
  FaBuilding,
  FaUserPlus,
  FaBirthdayCake,
} from "react-icons/fa";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { ToastContainer } from "react-toastify";
import { collection, getDocs, query, where, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db, rtdb } from "@/firebase";
import CardComponent from "@/components/CardComponents";
import { get, ref, DataSnapshot } from "firebase/database";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface AttendanceSummary {
  present: number;
  absent: number;
  leave: number;
  restday: number;
}

interface Branch {
  id: string;
  name: string;
}

interface StaffData {
  [branch: string]: {
    [department: string]: {
      total: number;
      present: number;
    };
  };
}

const AdminDashboard: React.FC = () => {
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalBranches, setTotalBranches] = useState<number>(0);
  const [formerEmployees, setFormerEmployees] = useState<number>(0);
  const [recentHires, setRecentHires] = useState<number>(0);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<number>(0);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary>({
    present: 0,
    absent: 0,
    leave: 0,
    restday: 0,
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [staffData, setStaffData] = useState<StaffData>({});

  const fetchTotalEmployees = async (): Promise<void> => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      setTotalEmployees(querySnapshot.size);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      oneWeekAgo.setHours(0, 0, 0, 0);

      let recentHiresCount = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.startDate) {
          let startDate: Date;
          if (typeof data.startDate === "string") {
            startDate = new Date(data.startDate);
          } else if (data.startDate.toDate) {
            startDate = data.startDate.toDate();
          } else {
            console.error("Unexpected startDate format:", data.startDate);
            return;
          }

          startDate.setHours(0, 0, 0, 0);

          if (startDate >= oneWeekAgo) {
            recentHiresCount++;
          }
        }
      });
      setRecentHires(recentHiresCount);
    } catch (error) {
      console.error("Error fetching total employees: ", error);
    }
  };

  const fetchTotalBranches = async (): Promise<void> => {
    try {
      const querySnapshot = await getDocs(collection(db, "branches"));
      setTotalBranches(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching total branches: ", error);
    }
  };

  const fetchFormerEmployees = async (): Promise<void> => {
    try {
      const querySnapshot = await getDocs(collection(db, "former_employees"));
      setFormerEmployees(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching former employees: ", error);
    }
  };

  const fetchUpcomingBirthdays = async (): Promise<void> => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const today = new Date();
      const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      let birthdaysCount = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.birthday) {
          let birthdate: Date;
          if (typeof data.birthday === "string") {
            birthdate = new Date(data.birthday);
          } else if (data.birthday.toDate) {
            birthdate = data.birthday.toDate();
          } else {
            console.error("Unexpected birthday format:", data.birthday);
            return;
          }

          birthdate.setHours(0, 0, 0, 0);
          const thisBirthday = new Date(
            today.getFullYear(),
            birthdate.getMonth(),
            birthdate.getDate()
          );

          if (thisBirthday >= today && thisBirthday <= oneWeekLater) {
            birthdaysCount++;
          }
        }
      });
      setUpcomingBirthdays(birthdaysCount);
    } catch (error) {
      console.error("Error fetching upcoming birthdays: ", error);
    }
  };

  const fetchAttendanceSummary = async (): Promise<void> => {
    try {
      const usersQuery = query(collection(db, "users"), where("role", "!=", "admin"));
      const usersSnapshot = await getDocs(usersQuery);
      const totalUsers = usersSnapshot.size;

      let presentCount = 0;
      const currentDate = new Date().toISOString().split('T')[0];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userIdRef = userData.userIdRef;

        if (userIdRef) {
          const userIdSnapshot = await get(ref(rtdb, `users/${userIdRef}/userid`));
          const userId = userIdSnapshot.val();

          if (userId) {
            const attendanceSnapshot = await get(ref(rtdb, `attendance/${currentDate}/id_${userId}`));
            if (attendanceSnapshot.exists()) {
              presentCount++;
            }
          }
        }
      }

      const absentCount = totalUsers - presentCount;

      setAttendanceSummary({
        present: presentCount,
        absent: absentCount,
        leave: 0,
        restday: 0,
      });

      setTotalEmployees(totalUsers);
    } catch (error) {
      console.error("Error fetching attendance summary: ", error);
    }
  };

  const fetchBranches = async (): Promise<void> => {
    try {
      const branchesSnapshot = await getDocs(collection(db, "branches"));
      const branchesData = branchesSnapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
      setBranches(branchesData);
    } catch (error) {
      console.error("Error fetching branches: ", error);
    }
  };

  const fetchDepartments = async (): Promise<void> => {
    try {
      const departmentsSnapshot = await getDocs(collection(db, "departments"));
      const departmentsData = departmentsSnapshot.docs.map(doc => doc.data().name);
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Error fetching departments: ", error);
    }
  };

  const fetchStaffData = async (): Promise<void> => {
    try {
      const usersQuery = query(collection(db, "users"), where("role", "!=", "admin"));
      const usersSnapshot = await getDocs(usersQuery);
      const currentDate = new Date().toISOString().split('T')[0];

      const staffCounts: StaffData = {};

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const { branch, department, userIdRef } = userData;

        if (!staffCounts[branch]) {
          staffCounts[branch] = {};
        }
        if (!staffCounts[branch][department]) {
          staffCounts[branch][department] = { total: 0, present: 0 };
        }

        staffCounts[branch][department].total++;

        if (userIdRef) {
          const userIdSnapshot = await get(ref(rtdb, `users/${userIdRef}/userid`));
          const userId = userIdSnapshot.val();

          if (userId) {
            const attendanceSnapshot = await get(ref(rtdb, `attendance/${currentDate}/id_${userId}`));
            if (attendanceSnapshot.exists()) {
              staffCounts[branch][department].present++;
            }
          }
        }
      }

      setStaffData(staffCounts);
    } catch (error) {
      console.error("Error fetching staff data: ", error);
    }
  };

  useEffect(() => {
    fetchAttendanceSummary();
    fetchTotalEmployees();
    fetchFormerEmployees();
    fetchUpcomingBirthdays();
    fetchTotalBranches();
    fetchDepartments();
    fetchBranches();
    fetchStaffData();
  }, []);

  const doughnutData: ChartData<"doughnut"> = {
    labels: ["Present", "Absent", "Leave", "Restday"],
    datasets: [
      {
        data: [
          attendanceSummary.present,
          attendanceSummary.absent,
          attendanceSummary.leave,
          attendanceSummary.restday,
        ],
        backgroundColor: ["#40ae75", "#E57373", "#238F99", "#104A55"],
        hoverBackgroundColor: ["#238F99", "#E57372", "#1A7680", "#135D66"],
      },
    ],
  };

  const cardData = [
    { title: "Total Employees", icon: FaUsers, value: totalEmployees },
    { title: "Total Branches", icon: FaBuilding, value: totalBranches },
    { title: "Recent Hires", icon: FaUserPlus, value: recentHires },
    { title: "Former Employees", icon: FaUserMinus, value: formerEmployees },
    { title: "Upcoming Birthdays", icon: FaBirthdayCake, value: upcomingBirthdays },
  ];

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  const generateChartData = (branchName: string): ChartData<"bar"> => {
    const branchData = staffData[branchName] || {};
    const stableData: number[] = [];
    const understaffData: number[] = [];

    departments.forEach(dept => {
      const deptData = branchData[dept] || { total: 0, present: 0 };
      const { total, present } = deptData;

      if (present >= total / 2.5) {
        stableData.push(present);
        understaffData.push(0);
      } else {
        stableData.push(0);
        understaffData.push(total - present);
      }
    });

    return {
      labels: departments,
      datasets: [
        {
          label: 'Stable',
          data: stableData,
          backgroundColor: '#135D66',
        },
        {
          label: 'UnderStaff',
          data: understaffData,
          backgroundColor: '#E57373',
        },
      ],
    };
  };

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="container h-full mx-auto p-4 dark:text-zinc-200">
            <ToastContainer />
            <CardComponent cardData={cardData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border dark:border-zinc-800">
                <h2 className="text-lg font-semibold mb-2">Attendance Summary</h2>
                <Doughnut data={doughnutData} />
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border dark:border-zinc-800">
                {branches.map((branch) => (
                  <div key={branch.id} className="border p-1 mb-4">
                    <h3 className="text-md font-semibold mb-2">{branch.name} Staff Headcounts</h3>
                    <Bar options={options} data={generateChartData(branch.name)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default AdminDashboard;