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
  nickname: string;
  isEmailVerified: boolean;
  profilePicUrl: string;
}

interface UserStore {
  userData: User | null;
  user: object | null;
  loading: boolean;
  error: string | null;
  fetchUserData: (uid: string) => Promise<void>;
  setUserData: (data: Partial<User>) => void;
  setUser: (data: object) => void;
  signOut: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  userData: null,
  user: null,
  loading: false,
  error: null,

  setUser: (data: object) => {
    set((state) => ({ user: data }));
  },

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

  setUserData: (data: Partial<User>) => {
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
