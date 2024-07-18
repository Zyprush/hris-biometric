"use client";
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { AdminRouteGuard } from '@/components/AdminRouteGuard';

interface Department {
    id: string;
    name: string;
}

const Department = () => {
    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        const departmentsCollection = collection(db, 'departments');
        const departmentsSnapshot = await getDocs(departmentsCollection);
        const departmentsList = departmentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Department));
        setDepartments(departmentsList);
    };

    const addDepartment = async () => {
        const name = prompt('Enter department name:');
        if (name) {
            const departmentsCollection = collection(db, 'departments');
            await addDoc(departmentsCollection, { name });
            fetchDepartments();
        }
    };

    return (
        <AdminRouteGuard>
            <div className="p-4 relative">
                <button
                    onClick={addDepartment}
                    className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Department
                </button>
                <div className="mt-16 grid grid-cols-5 gap-4">
                    {departments.map((dept) => (
                        <div key={dept.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-lg font-semibold text-blue-600 mb-3 truncate text-center">{dept.name}</h2>
                            <div className="space-y-1 text-sm">
                                <p className="text-gray-700">
                                    <span className="font-medium">Present:</span> 0
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Absent:</span> 0
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Rest Day:</span> 0
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Leave:</span> 0
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminRouteGuard>
    )
}

export default Department