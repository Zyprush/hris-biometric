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
  fetchHistoryByAdmin: () => Promise<void>;
  addHistory: (data: object) => Promise<void>;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: null,
  loadingHistory: false,

  addHistory: async (data: object) => {
    set({ loadingHistory: true });
    console.log("try adding history", data);
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

  fetchHistoryByAdmin: async () => {
    set({ loadingHistory: true });
    try {
      const historyByUserQuery = query(
        collection(db, "history"),
        where("type", "in", ["admin", "leave"]),
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
        where("type", "==", "login"),
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
}));
