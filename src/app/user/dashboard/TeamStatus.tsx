"use client";
import { db } from "@/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { isUserPresent } from "./teamstats";

interface Props {
  userData: any;
}

interface UserData {
  role: "user" | "admin";
  name: string;
  nickname?: string;
  department?: string;
  profilePicUrl?: string;
  userRefId?: string;
  isPresent?: boolean; // Add this field to store presence status
}

const TeamStatus = ({ userData }: Props) => {
  const [teamData, setTeamData] = useState<UserData[]>([]);

  const fetchTeamData = useMemo(
    () => async () => {
      if (userData?.department) {
        try {
          const teamQuery = query(
            collection(db, "users"),
            where("department", "==", userData.department)
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
    [userData?.department]
  );

  useEffect(() => {
    if (userData?.department) {
      fetchTeamData();
    }
  }, [userData?.department, fetchTeamData]);

  return (
    <div className="bg-white rounded-lg shadow p-6 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-neutral dark:text-white">
        Team Status
      </h2>
      <ul className="space-y-4">
        {teamData.map((member, index) => (
          <li key={index} className="flex items-center text-neutral gap-2">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member?.profilePicUrl || "/img/profile-male.jpg"}
              alt={member?.name}
              className="rounded-full object-cover w-14 h-14 border-2 border-primary"
            />
            <span className="font-semibold text-sm flex flex-col items-start">
              <p className="dark:text-zinc-200 font-normal text-zinc-500 text-xs">{member.name}</p>
              <p
                className={`p-1 px-2 rounded-md text-white w-auto ${
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
  );
};

export default TeamStatus;
