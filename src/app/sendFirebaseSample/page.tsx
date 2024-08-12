"use client";

import { useEffect } from "react";
import { db } from "@/firebase"; 
import { collection, addDoc } from "firebase/firestore";
import Loading from "@/components/bioLoading";

const ProcessDataPage = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the API
        const response = await fetch("/pages/api/getAllExample");
        const data = await response.json();

        if (response.ok) {
          const { attendances, users } = data;

          // Process the attendances
          const processedAttendances = attendances.data.map((attendance: any) => ({
            ...attendance
            //type: getType(attendance),  // Implement this function based on your logic
            //state: getState(attendance) // Implement this function based on your logic
          }));

          // Process the users
          const processedUsers = users.data.map((user: any) => ({
            ...user,
            role: parseRole(user.role),  // Implement this function based on your logic
          }));

          // Save processed data to Firestore
          await saveToFirestore(processedAttendances, processedUsers);

          console.log("Data processed and saved to Firestore successfully.");
        } else {
          console.error("Failed to fetch data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchData();
  }, []);

  const saveToFirestore = async (attendances: any[], users: any[]) => {
    try {
      const attendanceCollectionRef = collection(db, "processedAttendances");
      const userCollectionRef = collection(db, "processedUsers");

      // Add each processed attendance to the Firestore collection
      for (const attendance of attendances) {
        await addDoc(attendanceCollectionRef, attendance);
      }

      // Add each processed user to the Firestore collection
      for (const user of users) {
        await addDoc(userCollectionRef, user);
      }
    } catch (error) {
      console.error("Error saving data to Firestore:", error);
    }
  };

  return;
};

// Utility functions to determine type, state, and role
const getType = (attendance: any): string => {
  // Add logic to determine the type (check-in, check-out, etc.)
  return "check-in"; // Replace with actual logic
};

const getState = (attendance: any): string => {
  // Add logic to determine the state (fingerprint, face, etc.)
  return "fingerprint"; // Replace with actual logic
};

const parseRole = (role: number): string => {
  switch (role) {
    case 14:
      return "Admin";
    case 0:
      return "User";
    default:
      return "Unknown";
  }
};

export default ProcessDataPage;
