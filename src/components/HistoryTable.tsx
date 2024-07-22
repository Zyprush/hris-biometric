import React from "react";
import Loading from "@/components/bioLoading";
import { FaCommentAlt } from "react-icons/fa";
import { format } from "date-fns";

interface HistoryItem {
  id: string;
  time: string | null;
  text: string;
}

interface HistoryTableProps {
  loading: boolean;
  history: HistoryItem[] | null;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ loading, history }) => {
  if (loading) {
    return <Loading />;
  }

  if (!history || history.length === 0) {
    return (
      <span className="flex mx-auto text-xs font-semibold text-zinc-700 p-2 border rounded-lg gap-2 items-center">
        <FaCommentAlt /> No history to display!
      </span>
    );
  }

  return (
    <div className="container mx-auto p-4 h-full">
      <div className="grid grid-cols-1 gap-4">
        <div className="overflow-x-auto">
          <table className="mb-5 text-sm rounded-lg border max-w-[72rem] min-w-full divide-y divide-gray-200">
            <thead className="bg-primary">
              <tr className="text-sm text-white font-semibold">
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Time</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((h) => (
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
  );
};

export default HistoryTable;
