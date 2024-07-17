import { create } from "zustand";
import { db } from "@/firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";

interface HistoryStore {
  history: Array<any> | null;
  loadingHistory: boolean;
  fetchHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: null,
  loadingHistory: false,

  fetchHistory: async () => {
    set({ loadingHistory: true });
    try {
      const historyQuery = query(collection(db, "history"), limit(50));
      const historyDocSnap = await getDocs(historyQuery);
      if (historyDocSnap) {
        set({ history: historyDocSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })), loadingHistory: false });
      } else {
        set({ loadingHistory: false });
      }
    } catch (error: any) {
      console.log('error', error)
      set({loadingHistory: false });
    }
  },
  addHistory: async (data: object)=> {
    set({ loadingHistory: true});
    set({loadingHistory: false });

  }
}));
