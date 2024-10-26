"use client";
import { db } from "@/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import { ref, get } from "firebase/database";
import { rtdb } from "@/firebase";
import React, { useEffect, useMemo, useState } from "react";

interface UserData {
  name: string;
  nickname?: string;
  department?: string;
  profilePicUrl?: string;
  userIdRef?: string;
  isPresent?: boolean;
}

interface DepartmentProps {
  dept: any;
  selectedBranch: string;
}

const Department: React.FC<DepartmentProps> = ({ dept, selectedBranch }) => {
  const [teamData, setTeamData] = useState<UserData[]>([]);

  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    //return `2024-10-22`; //this is for testing
  };

  const checkUserPresence = async (userIdRef: string): Promise<boolean> => {
    try {
      // Get the user data from RTDB
      const userRef = ref(rtdb, `users/${userIdRef}`);
      const userSnapshot = await get(userRef);
      
      if (!userSnapshot.exists()) {
        console.log(`No user found for userRefId: ${userIdRef}`);
        return false;
      }

      const userData = userSnapshot.val();
      const userId = userData.userid;

      if (!userId) {
        console.log(`No userid found for userRefId: ${userIdRef}`);
        return false;
      }

      // Check attendance/currentDate/id_{userId}
      const currentDate = getCurrentDate();
      const attendanceRef = ref(rtdb, `attendance/${currentDate}`);
      const attendanceSnapshot = await get(attendanceRef);

      // Check if there's any entry with id_{userId}
      if (attendanceSnapshot.exists()) {
        const attendanceData = attendanceSnapshot.val();
        return Object.keys(attendanceData).some(key => key === `id_${userId}`);
      }

      return false;
    } catch (error) {
      console.error(`Error checking presence for userRefId ${userIdRef}:`, error);
      return false;
    }
  };

  const fetchTeamData = useMemo(
    () => async () => {
      if (dept) {
        try {
          const teamQuery =
            selectedBranch == "Filter"
              ? query(
                  collection(db, "users"),
                  where("department", "==", dept.name)
                )
              : query(
                  collection(db, "users"),
                  where("department", "==", dept.name),
                  where("branch", "==", selectedBranch)
                );

          const teamDocSnap = await getDocs(teamQuery);
          const teamData = await Promise.all(
            teamDocSnap.docs.map(async (doc) => {
              const data = doc.data() as UserData;
              // Check if the user is present using the new logic
              if (data.userIdRef) {
                const isPresent = await checkUserPresence(data.userIdRef);
                data.isPresent = isPresent;
              } else {
                data.isPresent = false;
              }
              return data;
            })
          );
          
          setTeamData(teamData);
        } catch (error) {
          console.error("Error fetching team data:", error);
        }
      }
    },
    [dept, selectedBranch]
  );

  useEffect(() => {
    if (dept) {
      fetchTeamData();
    }
  }, [dept, fetchTeamData]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full min-h-80">
      <h2 className="text-lg font-semibold text-primary mb-3 truncate text-center dark:text-secondary">
        {dept.name} ({dept.employeeCount})
      </h2>
      <div className="flex flex-col items-center">
        <div className="w-full h-full mb-4">
          <ul className="space-y-2">
            {teamData.map((member, index) => (
              <li key={index} className="flex items-center text-neutral gap-2">
                <img
                  src={member?.profilePicUrl || "/img/profile-male.jpg"}
                  alt={member?.name}
                  className="rounded-full object-cover w-10 h-10 border-2 border-primary"
                />
                <span className="font-semibold text-sm flex flex-col items-start">
                  <p className="dark:text-zinc-200 font-normal text-zinc-500 text-xs">
                    {member.name}
                  </p>
                  <p
                    className={`p-1 flex items-center justify-center px-2 rounded-md text-white w-auto ${
                      member.isPresent ? "bg-[#61a34a]" : "bg-red-500"
                    }`}
                  >
                    {member.isPresent ? "present" : "absent"}
                  </p>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Department;