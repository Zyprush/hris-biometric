"use client";
import React, { useEffect } from "react";
import { useHistoryStore } from "@/state/history";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import HistoryTable from "@/components/HistoryTable";

const AdminHistory = () => {
  const { history, loadingHistory, fetchHistoryByAdmin } = useHistoryStore();

  useEffect(() => {
    fetchHistoryByAdmin();
  }, [fetchHistoryByAdmin]);

  return (
    <AdminRouteGuard>
      <HistoryTable loading={loadingHistory} history={history} />
    </AdminRouteGuard>
  );
};

export default AdminHistory;
