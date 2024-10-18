"use client";
import { isUserPresent } from "@/app/user/dashboard/teamstats";
import { db } from "@/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";

interface UserData {
  name: string;
  nickname?: string;
  department?: string;
  profilePicUrl?: string;
  userRefId?: string;
  isPresent?: boolean;
}
interface Department {
  name: string;
  selectedBranch: string;
}
interface DepartmentProps {
  dept: any;
  selectedBranch: string;
}

const Department: React.FC<DepartmentProps> = ({
  dept,
  selectedBranch
}) => {
  const [teamData, setTeamData] = useState<UserData[]>([]);

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
              // Check if the user is present
              if (data.userRefId) {
                const isPresent = await isUserPresent(data.userRefId);
                data.isPresent = isPresent;
              } else {
                data.isPresent = false;
              }
              return data;
            })
          );
          // Set the updated team data with presence status
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
                      member.isPresent ? "bg-[#61a34a]" : "bg-neutral"
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