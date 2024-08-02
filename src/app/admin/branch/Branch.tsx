"use client";
import { useState, useEffect, useRef } from 'react';
import { db, storage } from '@/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { AdminRouteGuard } from '@/components/AdminRouteGuard';

interface Branch {
    id: string;
    name: string;
    location: string;
    totalEmployees: number;
    totalDepartments: number;
    imageUrl: string;
}

const BranchComponent = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
    const [newBranch, setNewBranch] = useState({ name: '', location: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        const branchesCollection = collection(db, 'branches');
        const branchesSnapshot = await getDocs(branchesCollection);
        const branchesList = await Promise.all(branchesSnapshot.docs.map(async doc => {
            const branchData = doc.data() as { name: string, location: string, imageUrl: string };
            const totalEmployees = await fetchTotalEmployees(branchData.name);
            const totalDepartments = await fetchTotalDepartments(branchData.name);
            return {
                id: doc.id,
                name: branchData.name,
                location: branchData.location,
                totalEmployees,
                totalDepartments,
                imageUrl: branchData.imageUrl || ''
            };
        }));
        setBranches(branchesList);
    };

    const fetchTotalEmployees = async (branchName: string): Promise<number> => {
        const usersCollection = collection(db, 'users');
        const q = query(usersCollection, where('branch', '==', branchName));
        const usersSnapshot = await getDocs(q);
        return usersSnapshot.size;
    };

    const fetchTotalDepartments = async (branchName: string): Promise<number> => {
        const departmentsCollection = collection(db, 'departments');
        const q = query(departmentsCollection, where('branch', '==', branchName));
        const departmentsSnapshot = await getDocs(q);
        return departmentsSnapshot.size;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewBranch(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newBranch.name && newBranch.location) {
            let imageUrl = currentBranch?.imageUrl || '';
            if (selectedFile) {
                const storageRef = ref(storage, `branch-images/${newBranch.name}`);
                await uploadBytes(storageRef, selectedFile);
                imageUrl = await getDownloadURL(storageRef);
            }
            
            if (modalMode === 'add') {
                const branchesCollection = collection(db, 'branches');
                await addDoc(branchesCollection, { ...newBranch, imageUrl });
            } else if (modalMode === 'edit' && currentBranch) {
                const branchDoc = doc(db, 'branches', currentBranch.id);
                await updateDoc(branchDoc, { ...newBranch, imageUrl });
            }
            
            fetchBranches();
            closeModal();
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setNewBranch({ name: '', location: '' });
        setCurrentBranch(null);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const openEditModal = (branch: Branch) => {
        setModalMode('edit');
        setNewBranch({ name: branch.name, location: branch.location });
        setCurrentBranch(branch);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setNewBranch({ name: '', location: '' });
        setCurrentBranch(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (branch: Branch) => {
        if (window.confirm(`Are you sure you want to delete ${branch.name}?`)) {
            const branchDoc = doc(db, 'branches', branch.id);
            await deleteDoc(branchDoc);

            if (branch.imageUrl) {
                const storageRef = ref(storage, `branch-images/${branch.name}`);
                await deleteObject(storageRef);
            }

            fetchBranches();
        }
    };

    return (
        <AdminRouteGuard>
            <div className="p-4 relative">
                <button
                    onClick={openAddModal}
                    className="absolute top-4 right-4 bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded"
                >
                    Add Branch
                </button>
                <div className="mt-16 grid grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <div key={branch.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
                            {branch.imageUrl && (
                                <img 
                                    src={branch.imageUrl} 
                                    alt={`${branch.name} branch`} 
                                    className="w-full h-48 object-cover mb-4 rounded"
                                />
                            )}
                            <h2 className="text-xl font-semibold text-green-600 mb-4">{branch.name}</h2>
                            <div className="space-y-2">
                                <p className="text-gray-700 dark:text-zinc-100">
                                    <span className="font-medium">Location:</span> {branch.location}
                                </p>
                                <p className="text-gray-700 dark:text-zinc-100">
                                    <span className="font-medium">Employees:</span> {branch.totalEmployees}
                                </p>
                            </div>
                            <div className="mt-4 space-x-2">
                                <button
                                    onClick={() => openEditModal(branch)}
                                    className="bg-primary hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(branch)}
                                    className="bg-error hover:bg-red-600 text-white font-semibold py-1 px-2 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4">{modalMode === 'add' ? 'Add New Branch' : 'Edit Branch'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block mb-1">Branch Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newBranch.name}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-2 py-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="location" className="block mb-1">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        name="location"
                                        value={newBranch.location}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-2 py-1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="image" className="block mb-1">Branch Image</label>
                                    <input
                                        type="file"
                                        id="image"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="w-full"
                                        accept="image/*"
                                    />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded"
                                    >
                                        {modalMode === 'add' ? 'Add Branch' : 'Update Branch'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminRouteGuard>
    )
}

export default BranchComponent;