"use client";
import AdminLayout from "@/components/AdminLayout";
import Loading from "@/components/bioLoading";
import { SignedIn } from "@/components/signed-in";
import { useHistoryStore } from "@/state/history";
import { format , parse} from "date-fns";
import { useEffect } from "react";

const AdminHistory = () => {
  const { history, loadingHistory, fetchHistory } = useHistoryStore();
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]); // Add fetchHistory as a dependency to useEffect

  return (
    <SignedIn>
      <AdminLayout>
        <div className="flex h-full w-full p-5">
          <div className="flex flex-col mx-auto border border-zinc-300 rounded-lg mt-5 overflow-x-auto scroll-container max-h-[32rem]">
            <table className="table table-zebra max-w-[72rem] table-pin-rows">
              <thead>
                <tr className="text-xs text-zinc-500">
                  <th className="text-xs">Date</th>
                  <th className="">Time</th>
                  <th className="">Action</th>
                </tr>
              </thead>
              <tbody>
                {history?.map((h) => (
                  <tr key={h.id} className="hover">
                    <td>{h?.time ? format(parse(h.time), 'yyyy-MM-dd HH:mm:ss', new Date()) : ""}</td>
                    <td></td>
                    <td>{h.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {loadingHistory && <Loading />}
          </div>
        </div>
      </AdminLayout>
    </SignedIn>
  );
};

export default AdminHistory;