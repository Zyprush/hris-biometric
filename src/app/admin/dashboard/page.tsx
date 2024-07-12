"use client";

import AdminLayout from "@/components/AdminLayout";
import { SignedIn } from "@/components/signed-in";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
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
import { FaUsers, FaUserCheck, FaUserTimes, FaUserAltSlash, FaCalendarAlt } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const AdminDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const setAuthChecked = (isChecked: boolean) => {
    console.log("Auth checked:", isChecked);
  };

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("User not authenticated. Redirecting to sign-in page...");
        router.push("../sign-in");
      }
      setAuthChecked(true);
    }
  }, [user, loading, router]);

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
    { title: "Total Employees", icon: FaUsers, color: "text-blue-500" },
    { title: "Present", icon: FaUserCheck, color: "text-green-500" },
    { title: "Absent", icon: FaUserTimes, color: "text-red-500" },
    { title: "Leaved", icon: FaUserAltSlash, color: "text-yellow-500" },
    { title: "Restday", icon: FaCalendarAlt, color: "text-purple-500" },
  ];

  return (
    <SignedIn>
      <AdminLayout>
        <div className="container mx-auto p-4">
          <div className="grid grid-cols-5 gap-4 mb-4">
            {cardData.map(({ title, icon: Icon, color }, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4 text-center">
                <Icon className={`text-3xl mb-2 mx-auto ${color}`} />
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-2xl font-bold">42</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">Attendance Summary</h2>
              <Doughnut data={doughnutData} />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Main Branch</h2>
                <Bar data={branch1} />
              </div>
              <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Branch 1</h2>
                <Bar data={branch2} />
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </SignedIn>
  );
};

export default AdminDashboard;
