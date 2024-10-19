"use client";

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
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import CardComponent from "@/components/CardComponents";
import EmployeeCount from "./EmployeeCount";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const AdminDashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalBraches, setTotalBraches] = useState(0);
  const [formerEmployees, setFormerEmployees] = useState(0);
  const [recentHires, setRecentHires] = useState(0);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState(0);
  const [presentEmployees, setPresentEmployees] = useState(0);
  const [absentEmployees, setAbsentEmployees] = useState(0);

  const fetchTotalEmployees = async () => {
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
          let startDate;
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

  const fetchAttendanceData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      let presentCount = 0;
      let absentCount = 0;

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const userData = doc.data();
          if (userData.userRefId) {
            const isPresent = await isUserPresent(userData.userRefId);
            if (isPresent) {
              presentCount++;
            } else {
              absentCount++;
            }
          } else {
            absentCount++;
          }
        })
      );

      setPresentEmployees(presentCount);
      setAbsentEmployees(absentCount);
    } catch (error) {
      console.error("Error fetching attendance data: ", error);
    }
  };

  const isUserPresent = async (userRefId: string) => {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const attendanceCollection = collection(db, "attendance");
      const attendanceQuery = query(
        attendanceCollection,
        where("userId", "==", userRefId),
        where("timestamp", ">=", startOfDay),
        where("timestamp", "<=", endOfDay)
      );

      const attendanceSnapshot = await getDocs(attendanceQuery);
      return !attendanceSnapshot.empty;
    } catch (error) {
      console.error("Error checking user presence: ", error);
      return false;
    }
  };

  const fetchTotalBraches = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "branches"));
      setTotalBraches(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching total branches: ", error);
    }
  };

  const fetchFormerEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "former_employees"));
      setFormerEmployees(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching former employees: ", error);
    }
  };

  const fetchUpcomingBirthdays = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const today = new Date();
      const oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

      let birthdaysCount = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.birthday) {
          let birthdate;
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

  useEffect(() => {
    fetchTotalEmployees();
    fetchFormerEmployees();
    fetchUpcomingBirthdays();
    fetchTotalBraches();
    fetchAttendanceData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doughnutData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [presentEmployees, absentEmployees],
        backgroundColor: ["#40ae75", "#1A7680"],
        hoverBackgroundColor: ["#238F99", "#135D66"],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        // text: 'Employee Attendance',
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const cardData = [
    { title: "Total Employees", icon: FaUsers, value: totalEmployees - 1 },
    { title: "Total Branches", icon: FaBuilding, value: totalBraches },
    { title: "Recent Hires", icon: FaUserPlus, value: recentHires },
    { title: "Former Employees", icon: FaUserMinus, value: formerEmployees },
    {
      title: "Upcoming Birthdays",
      icon: FaBirthdayCake,
      value: upcomingBirthdays,
    },
  ];

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="container h-full mx-auto p-4 dark:text-zinc-200">
            <ToastContainer />
            <CardComponent cardData={cardData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border dark:border-zinc-800">
                <h2 className="text-lg font-semibold mb-2">
                  Attendance Summary
                </h2>
                <div className="h-[300px]">
                  <Doughnut data={doughnutData} options={options} />
                </div>
              </div>
              <EmployeeCount />
            </div>
          </div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default AdminDashboard;