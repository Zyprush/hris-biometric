"use client";
import React, { useEffect } from "react";
import { useHistoryStore } from "@/state/history";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import HistoryTable from "@/components/HistoryTable";

const UserHistory = () => {
  const { history, fetchHistoryLogin, loadingHistory } = useHistoryStore();

  useEffect(() => {
    fetchHistoryLogin();
  }, [fetchHistoryLogin]);

  return (
    <AdminRouteGuard>
      <HistoryTable loading={loadingHistory} history={history} />
    </AdminRouteGuard>
  );
};

export default UserHistory;
