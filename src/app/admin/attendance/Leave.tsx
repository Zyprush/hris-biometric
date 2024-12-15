"use client";
import { auth, db } from "@/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  query, 
  where,
  limit 
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import LeaveModal from "./LeaveModal";
import LeaveRequests from "./LeaveRequests";
import LeaveInfo from "./LeaveInfo";
import { useTheme } from "next-themes";
import { PlusIcon, TrashIcon } from "lucide-react";

const Leave = () => {
  const { theme } = useTheme();
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<string[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("pending");
  const [activeTab, setActiveTab] = useState<string>("Pending");
  const [newLeaveType, setNewLeaveType] = useState<string>("");
  const [curRequest, setCurRequest] = useState<object>({});

  // Fetch requests based on status
  useEffect(() => {
    const fetchRequests = async () => {
      if (!user || activeTab === "Leave types") return;
      const querySnapshot = await getDocs(
        query(
          collection(db, "requests"),
          where("status", "==", status),
          limit(20)
        )
      );
      const userRequests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(userRequests);
    };
    fetchRequests();
  }, [user, showModal, status, activeTab]);

  // Fetch leave types
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      if (!user) return;
      const leaveTypesRef = collection(db, "leave_types");
      const querySnapshot = await getDocs(leaveTypesRef);
      const types = querySnapshot.docs.map(doc => doc.data().name);
      setLeaveTypes(types);
    };

    fetchLeaveTypes();
  }, [user]);

  // Add new leave type
  const handleAddLeaveType = async () => {
    if (!newLeaveType.trim()) return;
    
    try {
      // Check if leave type already exists
      if (leaveTypes.includes(newLeaveType.trim())) {
        alert("This leave type already exists!");
        return;
      }

      // Add to Firestore
      await addDoc(collection(db, "leave_types"), {
        name: newLeaveType.trim(),
        createdBy: user?.uid,
        createdAt: new Date()
      });

      // Update local state
      setLeaveTypes([...leaveTypes, newLeaveType.trim()]);
      setNewLeaveType("");
    } catch (error) {
      console.error("Error adding leave type:", error);
    }
  };

  // Delete leave type
  const handleDeleteLeaveType = async (typeToDelete: string) => {
    try {
      // Find and delete the document with the matching name
      const leaveTypesRef = collection(db, "leave_types");
      const q = query(leaveTypesRef, where("name", "==", typeToDelete));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach(async (document) => {
        await deleteDoc(document.ref);
      });

      // Update local state
      setLeaveTypes(leaveTypes.filter(type => type !== typeToDelete));
    } catch (error) {
      console.error("Error deleting leave type:", error);
    }
  };

  const openModal = (request: any) => {
    setShowModal(true);
    setCurRequest(request);
  };

  const openInfo = (request: any) => {
    setShowInfo(true);
    setCurRequest(request);
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
    if (tabName !== "Leave types") {
      setStatus(tabName.toLowerCase());
    }
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full items-start gap-4">
        {showModal && (
          <LeaveModal setShowModal={setShowModal} curRequest={curRequest} />
        )}
        {showInfo && (
          <LeaveInfo setShowInfo={setShowInfo} curRequest={curRequest} />
        )}
        
        <div role="tablist" className="tabs tabs-lifted w-full">
          {["Pending", "Approved", "Rejected", "Leave types"].map((tabName) => (
            <React.Fragment key={tabName}>
              <input
                type="radio"
                name="my_tabs_2"
                role="tab"
                className="tab text-sm font-bold text-neutral dark:text-primary"
                aria-label={tabName}
                defaultChecked={tabName === "Pending"}
                onClick={() => handleTabClick(tabName)}
              />
              <div
                role="tabpanel"
                className="tab-content bg-base-100 border-base-300 w-full rounded-box p-6"
              >
                {tabName === "Leave types" ? (
                  <div className="space-y-4">
                    {/* Leave Types Management */}
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="text"
                        value={newLeaveType}
                        onChange={(e) => setNewLeaveType(e.target.value)}
                        placeholder="Add new leave type"
                        className="input input-bordered w-full max-w-xs"
                      />
                      <button 
                        onClick={handleAddLeaveType}
                        className="btn btn-primary"
                      >
                        <PlusIcon size={20} />
                        Add
                      </button>
                    </div>

                    {/* List of Leave Types */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {leaveTypes.map((type) => (
                        <div 
                          key={type} 
                          className="flex justify-between items-center p-2 bg-base-200 rounded"
                        >
                          <span>{type}</span>
                          <button 
                            onClick={() => handleDeleteLeaveType(type)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <LeaveRequests
                    requests={requests}
                    openModal={openModal}
                    openInfo={openInfo}
                    status={status}
                  />
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leave;