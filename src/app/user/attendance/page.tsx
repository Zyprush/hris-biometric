import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import React from "react";

const page = () => {
  return (
    <SignedIn>
      <UserLayout>
        <div className="container md:p-10 flex flex-col justify-start items-center">
          <table className="min-w-full bg-white text-sm md:text-base">
            <thead className="">
              <tr className="border border-gray-300">
                <th className="py-2">Name</th>
                <th className="py-2 px-4 border border-gray-300" colSpan={2}>AM</th>
                <th className="py-2 px-4 border border-gray-300" colSpan={2}>PM</th>
                <th className="py-2 px-4 border border-gray-300" colSpan={2}></th>
              </tr>
              <tr className="border border-gray-300">
                <th className="py-2"></th>
                <th className="py-2 px-4 border border-gray-300" colSpan={2}>AM</th>
                <th className="py-2 px-4 border border-gray-300" colSpan={2}>PM</th>
                <th className="py-2 px-4 border border-gray-300" colSpan={2}></th>
              </tr>
            </thead>
            <tbody className="border border-gray-300">
              <tr className="border border-gray-300">
                <th className="py-2 px-4 border border-gray-300">Date</th>
                <th className="py-2 px-4 border border-gray-300">Time In</th>
                <th className="py-2 px-4 border border-gray-300">Time Out</th>
                <th className="py-2 px-4 border border-gray-300">Time In</th>
                <th className="py-2 px-4 border border-gray-300">Time Out</th>
                <th className="py-2 px-4 border border-gray-300">Overtime</th>
                <th className="py-2 px-4 border border-gray-300">Undertime</th>
              </tr>
              <tr className="border border-gray-300">
                <td className="py-2 px-4 border border-gray-300">2023-01-01</td>
                <td className="py-2 px-4 border border-gray-300">08:00 AM</td>
                <td className="py-2 px-4 border border-gray-300">12:00 PM</td>
                <td className="py-2 px-4 border border-gray-300">01:00 PM</td>
                <td className="py-2 px-4 border border-gray-300">05:00 PM</td>
                <td className="py-2 px-4 border border-gray-300">1 hour</td>
                <td className="py-2 px-4 border border-gray-300">0 hour</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </UserLayout>
    </SignedIn>
  );
};

export default page;
