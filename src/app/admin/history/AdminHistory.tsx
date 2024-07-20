"use client";
import AdminLayout from '@/components/AdminLayout';
import { SignedIn } from '@/components/signed-in';
import React, { useEffect } from 'react'
import { useHistoryStore } from "@/state/history";
import { format } from "date-fns";
import Loading from '@/components/Loading';
import { AdminRouteGuard } from '@/components/AdminRouteGuard';

const AdminHistory = () => {
    const { history, loadingHistory, fetchHistory } = useHistoryStore();

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return (
        <AdminRouteGuard>
            <div className="container mx-auto p-4 h-full">
                <div className="grid grid-cols-1 gap-4">
                <div className="overflow-x-auto">
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
                    </div>
                </div>
            </div>
        </AdminRouteGuard>
    );
}

export default AdminHistory