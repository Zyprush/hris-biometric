import { create } from "zustand";
import { db } from "@/firebase";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

interface HistoryStore {
  history: Array<any> | null;
  loadingHistory: boolean;
  fetchHistory: () => Promise<void>;
  fetchHistoryByUser: (userID: string) => Promise<void>;
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
        limit(50),
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


  fetchHistoryByUser: async (userID) => {
    set({ loadingHistory: true });
    try {
      const historyQuery = query(
        collection(db, "history"),
        limit(50),
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
