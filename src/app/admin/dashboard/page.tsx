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
import { FaUsers, FaUserCheck, FaUserTimes, FaUserAltSlash, FaCalendarAlt, FaUserMinus, FaBuilding, FaUserPlus, FaBirthdayCake } from 'react-icons/fa';
import {AdminRouteGuard} from "@/components/AdminRouteGuard";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const setAuthChecked = (isChecked: boolean) => {
    console.log("Auth checked:", isChecked);
  };

  const [totalEmployees, setTotalEmployees] = useState(0);
  const [formerEmployees, setFormerEmployees] = useState(0);
  const [recentHires, setRecentHires] = useState(0);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState(0);

  const fetchTotalEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      setTotalEmployees(querySnapshot.size);

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      oneWeekAgo.setHours(0, 0, 0, 0);  // Set to beginning of the day

      let recentHiresCount = 0;
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.startDate) {
          let startDate;
          if (typeof data.startDate === 'string') {
            // If startDate is stored as a string
            startDate = new Date(data.startDate);
          } else if (data.startDate.toDate) {
            // If startDate is a Firestore Timestamp
            startDate = data.startDate.toDate();
          } else {
            console.error('Unexpected startDate format:', data.startDate);
            return;
          }

          // Set startDate to beginning of the day for fair comparison
          startDate.setHours(0, 0, 0, 0);

          if (startDate >= oneWeekAgo) {
            recentHiresCount++;
            console.log('Recent hire found:', data.name, 'Start date:', startDate);  // Debugging log
          }
        }
      });
      setRecentHires(recentHiresCount);
      console.log('Total recent hires:', recentHiresCount);  // Debugging log
    } catch (error) {
      console.error("Error fetching total employees: ", error);
    }
  };

  const fetchFormerEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "former_employees"));
      setFormerEmployees(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching former employees: ", error);
    }
  }
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
          if (typeof data.birthday === 'string') {
            // If birthday is stored as a string
            birthdate = new Date(data.birthday);
          } else if (data.birthday.toDate) {
            // If birthday is a Firestore Timestamp
            birthdate = data.birthday.toDate();
          } else {
            console.error('Unexpected birthday format:', data.birthday);
            return;
          }

          // Ensure birthdate is set to the beginning of the day for fair comparison
          birthdate.setHours(0, 0, 0, 0);
          const thisBirthday = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());

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
  }, []);

  const doughnutData = {
    labels: ["Present", "Absent", "Leaved", "Restday"],
    datasets: [
      {
        data: [50, 10, 5, 20],
        backgroundColor: ["#34D399", "#F87171", "#FBBF24", "#60A5FA"],
        hoverBackgroundColor: ["#10B981", "#EF4444", "#F59E0B", "#3B82F6"],
      },
    ],
  };

  const branch1 = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Understaff",
        data: [30, 20, 10, 15, 25, 35],
        backgroundColor: "#EF4444",
      },
      {
        label: "Stable",
        data: [70, 80, 90, 85, 75, 65],
        backgroundColor: "#34D399",
      },
    ],
  };

  const branch2 = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Understaff",
        data: [30, 20, 10, 15, 25, 35],
        backgroundColor: "#EF4444",
      },
      {
        label: "Stable",
        data: [70, 80, 90, 85, 75, 65],
        backgroundColor: "#34D399",
      },
    ],
  };

  const cardData = [
    { title: "Total Employees", icon: FaUsers, color: "text-blue-500", value: totalEmployees - 1 },
    { title: "Total Branches", icon: FaBuilding, color: "text-green-500", value: 2 },
    { title: "Recent Hires", icon: FaUserPlus, color: "text-yellow-500", value: recentHires },
    { title: "Former Employees", icon: FaUserMinus, color: "text-red-500", value: formerEmployees },
    { title: "Upcoming Birthdays", icon: FaBirthdayCake, color: "text-purple-500", value: upcomingBirthdays },
  ];

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="container h-full mx-auto p-4">
            <ToastContainer />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
              {cardData.map(({ title, icon: Icon, color, value }, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-4 text-center border">
                  <Icon className={`text-3xl mb-2 mx-auto ${color}`} />
                  <h2 className="text-lg font-semibold">{title}</h2>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white shadow-md rounded-lg p-4 border">
                <h2 className="text-lg font-semibold mb-2">Attendance Summary</h2>
                <Doughnut data={doughnutData} />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4 border">
                  <h2 className="text-lg font-semibold mb-2">Main Branch</h2>
                  <Bar data={branch1} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-4 border">
                  <h2 className="text-lg font-semibold mb-2">Branch 1</h2>
                  <Bar data={branch2} />
                </div>
              </div>
            </div>
          </div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default AdminDashboard;
