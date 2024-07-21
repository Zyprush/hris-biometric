"use client";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import React, { useEffect } from "react";
import { useHistoryStore } from "@/state/history";
import { useUserStore } from "@/state/user";
import HistoryTable from "@/components/HistoryTable";

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
          <HistoryTable loading={loadingHistory} history={history}/>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default UserHistory;
