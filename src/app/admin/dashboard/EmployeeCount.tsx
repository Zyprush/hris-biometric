"use client";
import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { Chart, ChartConfiguration } from "chart.js/auto";

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
  const [selectedBranch, setSelectedBranch] = useState<string>("Filter");
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchDepartments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

  useEffect(() => {
    if (departments.length > 0) {
      updateChart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departments]);

  const fetchBranches = async () => {
    const branchesCollection = collection(db, "branches");
    const branchesSnapshot = await getDocs(branchesCollection);
    const branchesList = branchesSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name as string,
    }));
    setBranches([{ id: "Filter", name: "Filter" }, ...branchesList]);
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
    const usersQuery = selectedBranch === "Filter"
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

  const updateChart = () => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const config: ChartConfiguration = {
          type: 'bar',
          data: {
            labels: departments.map(dept => dept.name),
            datasets: [
              {
                label: 'Present Employees',
                data: departments.map(dept => dept.presentCount),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
              {
                label: 'Total Employees',
                data: departments.map(dept => dept.totalCount),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Employees'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Departments'
                }
              }
            }
          },
        };

        chartInstance.current = new Chart(ctx, config);
      }
    }
  };

  return (
    <AdminRouteGuard>
      <div className="border border-gray-200 shadow-md dark:border-gray-700 relative bg-white p-8 rounded-lg dark:bg-gray-800 dark:text-white h-full flex flex-col justify-center items-center">
        <div className="absolute top-4 right-4">
          <select
            value={selectedBranch}
            onChange={handleBranchChange}
            className="bg-white dark:bg-gray-700 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>
        <div className="h-full flex flex-col justify-center items-center">
          <canvas ref={chartRef} className="w-full h-full"/>
        </div>
      </div>
    </AdminRouteGuard>
  );
};

export default EmployeeCount;