import { create } from "zustand";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { NextRouter } from "next/router";

interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: string;
  phone: string;
  department: string;
  position: string;
  ssn: string;
  workPermitNumber: string;
  startDate: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUserData: (uid: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUserData: async (uid: string) => {
    set({ loading: true, error: null });
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        set({ user: userDocSnap.data() as User, loading: false });
      } else {
        set({ error: "User not found", loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  signOut: async () => {
    try {
      await auth.signOut();
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));