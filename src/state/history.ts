import { create } from "zustand";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

interface HistoryStore {
  history: Array<any> | null;
  loadingHistory: boolean;
  fetchHistory: () => Promise<void>;
  fetchHistoryByUser: (userId: string) => Promise<void>;
  fetchHistoryLogin: () => Promise<void>;
  addHistory: (data: object) => Promise<void>;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: null,
  loadingHistory: false,

  fetchHistory: async () => {
    set({ loadingHistory: true });
    try {
      const historyQuery = query(
        collection(db, "history"),
        orderBy("time", "desc")
      );
      const historyDocSnap = await getDocs(historyQuery);
      if (historyDocSnap) {
        set({
          history: historyDocSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          loadingHistory: false,
        });
      } else {
        set({ loadingHistory: false });
      }
    } catch (error: any) {
      console.log("error", error);
    }
    set({ loadingHistory: false });
  },


  fetchHistoryByUser: async (userId) => {
    set({ loadingHistory: true });
    try {
      const historyByUserQuery = query(
        collection(db, "history"),
        where("userId", "==", userId),
        orderBy("time", "desc")
      );
      const historyDocSnap = await getDocs(historyByUserQuery);
      if (historyDocSnap) {
        set({
          history: historyDocSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          loadingHistory: false,
        });
      } else {
        set({ loadingHistory: false });
      }
    } catch (error: any) {
      console.log("error", error);
    }
    set({ loadingHistory: false });
  },

  fetchHistoryLogin: async () => {
    set({ loadingHistory: true });
    try {
      const historyQuery = query(
        collection(db, "history"),
        where("login", "==", true),
        orderBy("time", "desc")
      );
      const historyDocSnap = await getDocs(historyQuery);
      if (historyDocSnap) {
        set({
          history: historyDocSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
          loadingHistory: false,
        });
      } else {
        set({ loadingHistory: false });
      }
    } catch (error: any) {
      console.log("error", error);
    }
    set({ loadingHistory: false });
  },

  addHistory: async (data: object) => {
    set({ loadingHistory: true });
    try {
      const submittedDoc = await addDoc(collection(db, "history"), data);
      console.log('Upload successful');
      set((state) => ({
        history: state.history
          ? [...state.history, submittedDoc]
          : [submittedDoc],
        loadingHistory: false,
      }));
    } catch (error) {
      console.log("error", error);
    }
    set({ loadingHistory: false });
  },
}));
