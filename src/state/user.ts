import { create } from "zustand";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: string;
  phone: string;
  department: string;
  position: string;
  startDate: string;
  sss: string;
  nickname:  string,
}

interface UserStore {
  userData: User | null;
  loading: boolean;
  error: string | null;
  fetchUserData: (uid: string) => Promise<void>;
  setUser: (data: Partial<User>) => void;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  loading: false,
  error: null,

  fetchUserData: async (uid: string) => {
    set({ loading: true, error: null });
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        set({ userData: userDocSnap.data() as User, loading: false });
      } else {
        set({ error: "User not found", loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setUser: (data: Partial<User>) => {
    set((state) => ({ userData: { ...state.userData!, ...data } }));
  },

  signOut: async () => {
    try {
      await auth.signOut();
      set({ userData: null });
    } catch (error: any) {
      set({ error: error.message });
    }
  },
}));