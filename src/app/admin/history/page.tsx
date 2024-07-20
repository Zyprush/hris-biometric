"use client";
import AdminLayout from "@/components/AdminLayout";
import Loading from "@/components/bioLoading";
import { SignedIn } from "@/components/signed-in";
import { useHistoryStore } from "@/state/history";
import { format } from "date-fns";
import { useEffect } from "react";

const AdminHistory = () => {
  const { history, loadingHistory, fetchHistory } = useHistoryStore();
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <SignedIn>
      <AdminLayout>
        <div className="flex h-full w-full p-5">
          <div className="flex flex-col mx-auto border border-zinc-300 mt-5">
            <table className="table table-pin-rows table-zebra max-w-[72rem]">
              <thead>
                <tr className="text-sm text-zinc-500 font-semibold">
                  <th className="">Date</th>
                  <th className="">Time</th>
                  <th className="">Action</th>
                </tr>
              </thead>
              <tbody>
                {history?.map((h) => (
                  <tr key={h.id} className="hover">
                    <td>{h?.time ? format(new Date(h?.time), "MMM dd, yyyy") : ""}</td>
                    <td>{h?.time ? format(new Date(h?.time), "hh:mm aaa") : ""}</td>
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