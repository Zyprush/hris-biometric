"use client";
import { useState, useEffect, Fragment } from "react";
import { db } from "@/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import Department from "./Department";

interface Depart {
  id: string;
  name: string;
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
}

const DepartmentList = () => {
  const [departments, setDepartments] = useState<Depart[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("Filter");

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch]);

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
        return {
          id: doc.id,
          name: departmentData.name,
        };
      })
    );
    setDepartments(departmentsList);
  };

  const addDepartment = async () => {
    const name = prompt("Enter department name:");
    if (name) {
      const departmentsCollection = collection(db, "departments");
      await addDoc(departmentsCollection, { name });
      fetchDepartments();
    }
  };

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBranch(event.target.value);
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
            return (
              <Fragment key={dept.id}>
                <Department dept={dept} selectedBranch={selectedBranch}/>
              </Fragment>
            );
          })}
        </div>
      </div>
    </AdminRouteGuard>
  );
};

export default DepartmentList;