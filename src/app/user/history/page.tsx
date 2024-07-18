"use client";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import React, { useEffect } from "react";
import { useHistoryStore } from "@/state/history";
import Loading from "@/components/bioLoading";
import { useUserStore } from "@/state/user";
import { format } from "date-fns";
import { FaCommentAlt } from "react-icons/fa";

const UserHistory = () => {
  const { history, loadingHistory, fetchHistoryByUser } = useHistoryStore();
  const { userData } = useUserStore();
  useEffect(() => {
    if (userData) {
      fetchHistoryByUser(userData.id);
    }
  }, [fetchHistoryByUser, userData]);

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div className="flex h-full w-full p-5">
            {history?.length ?? 0 > 0 ? (
              <div className="flex flex-col mx-auto border border-zinc-300 rounded-lg mt-5 overflow-x-auto scroll-container max-h-[32rem]">
                <table className="table table-zebra max-w-[72rem]">
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
                        <td>
                          {h?.time
                            ? format(new Date(h?.time), "MMM dd, yyyy")
                            : ""}
                        </td>
                        <td>
                          {h?.time
                            ? format(new Date(h?.time), "hh:mm aaa")
                            : ""}
                        </td>
                        <td>{h.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <span className="flex mx-auto text-xs font-semibold text-zinc-700 p-2 border rounded-lg gap-2 items-center">
              <FaCommentAlt /> No history to display!
            </span>
            )}
            {loadingHistory ? <Loading /> : null}
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default UserHistory;
