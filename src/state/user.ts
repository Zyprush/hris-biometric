import { create } from "zustand";
import { auth, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { UserDatainterface } from "./interface";


interface UserStore {
  userData: UserDatainterface | null;
  user: object | null;
  loading: boolean;
  error: string | null;
  fetchUserData: (uid: string) => Promise<void>;
  setUserData: (data: Partial<UserDatainterface>) => void;
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
        set({ userData: userDocSnap.data() as UserDatainterface, loading: false });
      } else {
        set({ error: "User not found", loading: false });
      }
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setUserData: (data: Partial<UserDatainterface>) => {
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
