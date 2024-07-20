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
          <div className="flex flex-col mx-auto mb-8">
            <table className="mb-5 text-sm rounded-lg border max-w-[72rem] min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-sm text-gray-700 font-semibold">
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history?.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-zinc-600">
                      {h?.time ? format(new Date(h?.time), "MMM dd, yyyy") : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {h?.time ? format(new Date(h?.time), "hh:mm aaa") : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{h.text}</td>
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
