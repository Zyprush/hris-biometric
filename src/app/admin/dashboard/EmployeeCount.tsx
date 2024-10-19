"use client";
import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Depart {
  id: string;
  name: string;
  presentCount: number;
  totalCount: number;
}

interface Branch {
  id: string;
  name: string;
}

interface UserData {
  role: "user" | "admin";
  name: string;
  nickname?: string;
  department?: string;
  profilePicUrl?: string;
  userRefId?: string;
  isPresent?: boolean;
  branch?: string;
}

const EmployeeCount = () => {
  const [departments, setDepartments] = useState<Depart[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("All Branches");

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [selectedBranch]);

  const fetchBranches = async () => {
    const branchesCollection = collection(db, "branches");
    const branchesSnapshot = await getDocs(branchesCollection);
    const branchesList = branchesSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name as string,
    }));
    setBranches([{ id: "All Branches", name: "All Branches" }, ...branchesList]);
  };

  const fetchDepartments = async () => {
    const departmentsCollection = collection(db, "departments");
    const departmentsSnapshot = await getDocs(departmentsCollection);
    const departmentsList = await Promise.all(
      departmentsSnapshot.docs.map(async (doc) => {
        const departmentData = doc.data() as { name: string };
        const { presentCount, totalCount } = await fetchEmployeeStats(departmentData.name);
        return {
          id: doc.id,
          name: departmentData.name,
          presentCount,
          totalCount,
        };
      })
    );
    setDepartments(departmentsList);
  };

  const fetchEmployeeStats = async (departmentName: string) => {
    const usersQuery = selectedBranch === "All Branches"
      ? query(
        collection(db, "users"),
        where("department", "==", departmentName)
      )
      : query(
        collection(db, "users"),
        where("department", "==", departmentName),
        where("branch", "==", selectedBranch)
      );

    const usersSnapshot = await getDocs(usersQuery);
    const users = await Promise.all(
      usersSnapshot.docs.map(async (doc) => {
        const userData = doc.data() as UserData;
        if (userData.userRefId) {
          userData.isPresent = await isUserPresent(userData.userRefId);
        } else {
          userData.isPresent = false;
        }
        return userData;
      })
    );

    const presentCount = users.filter(user => user.isPresent).length;
    const totalCount = users.length;

    return { presentCount, totalCount };
  };

  const isUserPresent = async (userRefId: string) => {
    // Implement the logic to check if the user is present
    // This is a placeholder function, replace with actual implementation
    return Math.random() < 0.5; // Randomly return true or false for demonstration
  };

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBranch(event.target.value);
  };

  const chartData = {
    labels: departments.map((dept) => dept.name),
    datasets: [
      {
        label: "Present Employees",
        data: departments.map((dept) => dept.presentCount),
        backgroundColor: "#40ae75",
        hoverBackgroundColor: "#238F99",
      },
      {
        label: "Total Employees",
        data: departments.map((dept) => dept.totalCount),
        backgroundColor: "#1A7680",
        hoverBackgroundColor: "#135D66",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Employees",
        },
      },
      x: {
        title: {
          display: true,
          text: "Departments",
        },
      },
    },
  };

  return (
    <AdminRouteGuard>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 border dark:border-zinc-800 relative">
        <div className="absolute top-4 right-4">
          <select
            value={selectedBranch}
            onChange={handleBranchChange}
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-zinc-700 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        <h2 className="text-lg font-semibold mb-4">Employee Count Summary</h2>
        <div className="flex justify-center items-center">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </AdminRouteGuard>
  );
};

export default EmployeeCount;