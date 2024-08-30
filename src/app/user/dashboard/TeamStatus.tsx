"use client";
import { db, rtdb } from "@/firebase";
import { query, collection, where, getDocs } from "firebase/firestore";
import { ref, get, DataSnapshot } from "firebase/database";
import React, { useEffect, useMemo, useState } from "react";

interface Props {
  userData: any;
}

interface UserData {
  name: string;
  nickname?: string;
  department?: string;
  profilePicUrl?: string;
  userRefId?: string;
  isPresent?: boolean;
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
              if (data.userRefId) {
                data.isPresent = await isUserPresent(data.userRefId);
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

async function isUserPresent(userRefId: string): Promise<boolean> {
  try {
    // First, get the userId from the users node
    const userRef = ref(rtdb, `users/${userRefId}`);
    const userSnapshot: DataSnapshot = await get(userRef);
    const userData = userSnapshot.val();
    if (!userData || !userData.userid) {
      console.warn(`No valid RTDB data found for user with userRefId: ${userRefId}`);
      return false;
    }

    const userId = userData.userid;

    // Now, check the attendance for today
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const attendanceRef = ref(rtdb, `attendance/${today}`);
    const attendanceSnapshot: DataSnapshot = await get(attendanceRef);
    const attendanceData = attendanceSnapshot.val();

    if (!attendanceData) {
      return false; // No attendance data for today
    }

    // Check if the user has any entry for today
    for (const timeSlot of Object.values(attendanceData)) {
      for (const entry of Object.values(timeSlot as object)) {
        if ((entry as any).id === userId) {
          // User has an entry for today, consider them present
          return true;
        }
      }
    }

    // If we've gone through all entries and haven't found the user, they're absent
    return false;
  } catch (error) {
    console.error(`Error checking presence for user with userRefId: ${userRefId}:`, error);
    return false;
  }
}

export default TeamStatus;