import { create } from "zustand";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

interface LeaveStore {
  loading: boolean;
  monthLeave: number;
  yearLeave: number;
  fetchUserLeaveThisMonth: (uid: string) => Promise<void>;
  fetchUserLeaveThisYear: (uid: string) => Promise<void>;
}

export const useLeaveStore = create<LeaveStore>((set) => ({
  loading: false,
  monthLeave: 0,
  yearLeave: 0,

  fetchUserLeaveThisMonth: async (uid: string) => {
    set({ loading: true });
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const startOfMonth = `${year}-${month}-01`;
      const endOfMonth = `${year}-${month}-31`;

      const leaveQuery = query(
        collection(db, "requests"),
        where("userId", "==", uid),
        where("status", "==", "approved"),
        where("leaveDate", ">=", startOfMonth),
        where("leaveDate", "<=", endOfMonth)
      );

      const leaveSnapshot = await getDocs(leaveQuery);
      const leaveCount = leaveSnapshot.docs.length;

      set({ monthLeave: leaveCount });
    } catch (error) {
      console.error("Error fetching user leaves for this month:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchUserLeaveThisYear: async (uid: string) => {
    set({ loading: true });
    try {
      const now = new Date();
      const year = now.getFullYear();
      const startOfYear = `${year}-01-01`;
      const endOfYear = `${year}-12-31`;

      const leaveQuery = query(
        collection(db, "requests"),
        where("userId", "==", uid),
        where("status", "==", "approved"),
        where("leaveDate", ">=", startOfYear),
        where("leaveDate", "<=", endOfYear)
      );

      const leaveSnapshot = await getDocs(leaveQuery);
      const leaveCount = leaveSnapshot.docs.length;

      set({ yearLeave: leaveCount });
    } catch (error) {
      console.error("Error fetching user leaves for this year:", error);
    } finally {
      set({ loading: false });
    }
  },
}));
