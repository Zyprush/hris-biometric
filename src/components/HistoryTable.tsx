import React, { useState } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = history.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(history.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === i
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="container mx-auto p-4 h-full">
      <div className="grid grid-cols-1 gap-4">
        <div className="overflow-x-auto">
          <table className="table mb-5 text-sm rounded-lg border dark:border-zinc-600">
            <thead className="bg-primary">
              <tr className="text-md text-white font-semibold">
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Time</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 dark:text-zinc-100">
              {currentItems.map((h) => (
                <tr key={h.id} className="text-sm dark:border-zinc-600">
                  <td className="px-4 py-2 text-left">
                    {h?.time ? format(new Date(h?.time), "MMM dd, yyyy") : ""}
                  </td>
                  <td className="px-4 py-2 text-left">
                    {h?.time ? format(new Date(h?.time), "hh:mm aaa") : ""}
                  </td>
                  <td className="px-4 py-2 text-left">{h.text}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {history.length > itemsPerPage && (
            <div className="flex justify-between items-center">
              <button
                className={`px-4 py-2 bg-primary text-white rounded-lg ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <div>{renderPageNumbers()}</div>
              <button
                className={`px-4 py-2 bg-primary text-white rounded-lg ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
