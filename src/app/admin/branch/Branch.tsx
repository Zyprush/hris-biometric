"use client";
import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { AdminRouteGuard } from '@/components/AdminRouteGuard';

interface Branch {
    id: string;
    name: string;
    location: string;
}

const Branch = () => {
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        const branchesCollection = collection(db, 'branches');
        const branchesSnapshot = await getDocs(branchesCollection);
        const branchesList = branchesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Branch));
        setBranches(branchesList);
    };

    const addBranch = async () => {
        const name = prompt('Enter branch name:');
        const location = prompt('Enter branch location:');
        if (name && location) {
            const branchesCollection = collection(db, 'branches');
            await addDoc(branchesCollection, { name, location });
            fetchBranches();
        }
    };

    return (
        <AdminRouteGuard>
            <div className="p-4 relative">
                <button
                    onClick={addBranch}
                    className="absolute top-4 right-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Branch
                </button>
                <div className="mt-16 grid grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <div key={branch.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <h2 className="text-xl font-semibold text-green-600 mb-4">{branch.name}</h2>
                            <div className="space-y-2">
                                <p className="text-gray-700">
                                    <span className="font-medium">Location:</span> {branch.location}
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Employees:</span> 120
                                </p>
                                <p className="text-gray-700">
                                    <span className="font-medium">Departments:</span> 10
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminRouteGuard>
    )
}

export default Branch