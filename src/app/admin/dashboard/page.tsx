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
import { get, ref } from "firebase/database";

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
  const setAuthChecked = (isChecked: boolean) => {
    console.log("Auth checked:", isChecked);
  };

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
      oneWeekAgo.setHours(0, 0, 0, 0); // Set to beginning of the day

      let recentHiresCount = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.startDate) {
          let startDate;
          if (typeof data.startDate === "string") {
            // If startDate is stored as a string
            startDate = new Date(data.startDate);
          } else if (data.startDate.toDate) {
            // If startDate is a Firestore Timestamp
            startDate = data.startDate.toDate();
          } else {
            console.error("Unexpected startDate format:", data.startDate);
            return;
          }

          // Set startDate to beginning of the day for fair comparison
          startDate.setHours(0, 0, 0, 0);

          if (startDate >= oneWeekAgo) {
            recentHiresCount++;
            console.log(
              "Recent hire found:",
              data.name,
              "Start date:",
              startDate
            ); // Debugging log
          }
        }
      });
      setRecentHires(recentHiresCount);
      console.log("Total recent hires:", recentHiresCount); // Debugging log
    } catch (error) {
      console.error("Error fetching total employees: ", error);
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
            // If birthday is stored as a string
            birthdate = new Date(data.birthday);
          } else if (data.birthday.toDate) {
            // If birthday is a Firestore Timestamp
            birthdate = data.birthday.toDate();
          } else {
            console.error("Unexpected birthday format:", data.birthday);
            return;
          }

          // Ensure birthdate is set to the beginning of the day for fair comparison
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

  const fetchAttendanceSummary = async () => {
    try {
      // Fetch all users except admin
      const usersQuery = query(collection(db, "users"), where("role", "!=", "admin"));
      const usersSnapshot = await getDocs(usersQuery);
      const totalUsers = usersSnapshot.size;

      let presentCount = 0;
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userIdRef = userData.userIdRef;

        if (userIdRef) {
          // Get user ID from RTDB
          const userIdSnapshot = await get(ref(rtdb, `users/${userIdRef}/userid`));
          const userId = userIdSnapshot.val();

          if (userId) {
            // Check attendance for the current date
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
        leave: 0, // TODO: Implement leave logic
        restday: 0, // TODO: Implement restday logic
      });

      setTotalEmployees(totalUsers);
    } catch (error) {
      console.error("Error fetching attendance summary: ", error);
    }
  };

  useEffect(() => {
    fetchAttendanceSummary();
    fetchTotalEmployees();
    fetchFormerEmployees();
    fetchUpcomingBirthdays();
    fetchTotalBraches();
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
