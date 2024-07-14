import UserRouteGuard from "@/app/UserRouteGuard/page";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import React from "react";
import { MdWorkHistory } from "react-icons/md";

const page = () => {
  const data = Array.from({ length: 20 }, (_, ind) => ({
    date: `Jul ${String(ind + 1).padStart(2, "0")}, 022`,
    time: `10:${String(ind).padStart(2, "0")}`,
    actions: ind % 2 === 0 ? "Leave Request" : "Report Absence",
  }));

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div className="container flex flex-col justify-start items-center md:p-10 p-4">
            <span className="flex gap-1 mx-auto md:ml-0 md:mr-auto font-bold mb-5">
              <MdWorkHistory className="text-xl" /> History
            </span>
            <span className="border flex container md:min-w-[40rem]">
              <table className="table table-zebra">
                <thead>
                  <tr className="text-xs text-zinc-500">
                    <th>Date</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.length < 1 ? (
                    <tr>
                      <td colSpan={3} className="text-red-500 text-xs">
                        No Actions History to show.
                      </td>
                    </tr>
                  ) : (
                    data.map((info, ind) => (
                      <tr key={ind}>
                        <td className="text-xs">{info.date}</td>
                        <td className="text-xs text-zinc-600">{info.time}</td>
                        <td className="text-xs text-zinc-600">
                          {info.actions}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </span>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default page;
