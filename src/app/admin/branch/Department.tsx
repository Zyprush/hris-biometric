"use client";
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { AdminRouteGuard } from '@/components/AdminRouteGuard';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Department {
    id: string;
    name: string;
    totalEmployees: number;
}

interface Branch {
    id: string;
    name: string;
}

const DepartmentComponent = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>("Filter");

    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchDepartments();
    }, [selectedBranch]);

    const fetchBranches = async () => {
        const branchesCollection = collection(db, 'branches');
        const branchesSnapshot = await getDocs(branchesCollection);
        const branchesList = branchesSnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name as string
        }));
        setBranches([{ id: 'Filter', name: 'Filter' }, ...branchesList]);
    };

    const fetchDepartments = async () => {
        const departmentsCollection = collection(db, 'departments');
        const departmentsSnapshot = await getDocs(departmentsCollection);
        const departmentsList = await Promise.all(departmentsSnapshot.docs.map(async doc => {
            const departmentData = doc.data() as { name: string };
            const totalEmployees = await fetchTotalEmployees(departmentData.name);
            return {
                id: doc.id,
                name: departmentData.name,
                totalEmployees
            };
        }));
        setDepartments(departmentsList);
    };

    const fetchTotalEmployees = async (departmentName: string): Promise<number> => {
        const usersCollection = collection(db, 'users');
        let q = query(usersCollection, where('department', '==', departmentName));
        
        if (selectedBranch !== "Filter") {
            q = query(q, where('branch', '==', selectedBranch));
        }
        
        const usersSnapshot = await getDocs(q);
        return usersSnapshot.size;
    };

    const addDepartment = async () => {
        const name = prompt('Enter department name:');
        if (name) {
            const departmentsCollection = collection(db, 'departments');
            await addDoc(departmentsCollection, { name });
            fetchDepartments();
        }
    };

    const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBranch(event.target.value);
    };

    const getChartData = (totalEmployees: number) => {
        if (totalEmployees === 0) {
            // Return placeholder data when there are no employees
            return {
                labels: ['No Data'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['rgba(200, 200, 200, 0.5)'],
                    borderColor: ['rgba(200, 200, 200, 1)'],
                    borderWidth: 1,
                }]
            };
        }

        const present = Math.floor(Math.random() * totalEmployees);
        const absent = Math.floor(Math.random() * (totalEmployees - present));
        const restDay = Math.floor(Math.random() * (totalEmployees - present - absent));
        const leave = totalEmployees - present - absent - restDay;

        return {
            labels: ['Present', 'Absent', 'Rest Day', 'Leave'],
            datasets: [
                {
                    data: [present, absent, restDay, leave],
                    backgroundColor: [
                        'rgba(75, 192, 92, 0.6)',  // Green for Present
                        'rgba(255, 99, 132, 0.6)', // Red for Absent
                        'rgba(255, 206, 86, 0.6)', // Yellow for Rest Day
                        'rgba(54, 162, 235, 0.6)', // Blue for Leave
                    ],
                    borderColor: [
                        'rgba(75, 192, 92, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1,
                },
            ],
        };
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
    };

    return (
        <AdminRouteGuard>
            <div className="p-4 relative">
                <div className="absolute top-4 right-4 flex space-x-4">
                    <select 
                        value={selectedBranch} 
                        onChange={handleBranchChange}
                        className="bg-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.name}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={addDepartment}
                        className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded"
                    >
                        Add Department
                    </button>
                </div>
                <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {departments.map((dept) => {
                        const chartData = getChartData(dept.totalEmployees);
                        return (
                            <div key={dept.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                <h2 className="text-lg font-semibold text-blue-600 mb-3 truncate text-center">{dept.name}</h2>
                                <div className="flex flex-col items-center">
                                    <div className="w-full h-48 mb-4">
                                        <Doughnut data={chartData} options={chartOptions} />
                                    </div>
                                    <div className="w-full grid grid-cols-2 gap-2 text-sm">
                                        <p className="text-gray-700 col-span-2 text-center mb-2">
                                            <span className="font-medium">Total: {dept.totalEmployees}</span>
                                        </p>
                                        <p className="text-gray-700 flex items-center">
                                            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                                            <span className="font-medium">Present:</span> {chartData.datasets[0].data[0]}
                                        </p>
                                        <p className="text-gray-700 flex items-center">
                                            <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                                            <span className="font-medium">Absent:</span> {chartData.datasets[0].data[1]}
                                        </p>
                                        <p className="text-gray-700 flex items-center">
                                            <span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                                            <span className="font-medium">Rest Day:</span> {chartData.datasets[0].data[2]}
                                        </p>
                                        <p className="text-gray-700 flex items-center">
                                            <span className="w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
                                            <span className="font-medium">Leave:</span> {chartData.datasets[0].data[3]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminRouteGuard>
    )
}

export default DepartmentComponent;