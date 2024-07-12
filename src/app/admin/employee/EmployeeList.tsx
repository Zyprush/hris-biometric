import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

const EmployeeList = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<any[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedEmployees: React.SetStateAction<any[]> = [];
        querySnapshot.forEach((doc) => {
          fetchedEmployees.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setEmployees(fetchedEmployees);
        setFilteredEmployees(fetchedEmployees); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = () => {
    const filtered = employees.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  };

  const handleViewDetails = (employeeId: string) => {
    // Handle displaying employee details (e.g., in a modal)
    console.log("View details for employee with ID: ", employeeId);
    // Implement your modal or detailed view logic here
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-sm input-bordered mr-2 rounded-sm w-full max-w-sm"
          />
          <button onClick={handleSearch} className="btn rounded-md btn-sm btn-primary text-white">
            Search
          </button>
        </div>
        <table className="table-auto w-full border rounded border-gray-200">
          <thead>
            <tr className="text-xs text-gray-500 bg-gray-100">
              <th className="px-4 py-2">Employee ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Remarks</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length < 1 ? (
              <tr>
                <td colSpan={4} className="text-red-500 text-xs">
                  No results
                </td>
              </tr>
            ) : (
              filteredEmployees.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-4 py-2 text-xs">{employee.employeeId}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{employee.name}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{employee.remarks}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleViewDetails(employee.id)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
