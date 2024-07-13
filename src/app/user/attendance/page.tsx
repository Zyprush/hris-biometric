"use client";
import FingerprintLoading from "@/components/Loading";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import { auth } from "@/firebase";
import { useUserStore } from "@/state/user";
import React, { useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactToPrint from "react-to-print";

const Attendance = () => {
  const componentRef = useRef<HTMLTableElement>(null);
  const [user, authLoading] = useAuthState(auth);
  const { user: userData, loading, fetchUserData } = useUserStore();
  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user, fetchUserData]);
  if (loading || !userData) {
    return (
      <UserLayout>
        <FingerprintLoading />
      </UserLayout>
    );
  }
  return (
    <SignedIn>
      <UserLayout>
        <div className="container p-2 md:p-10 flex flex-col justify-start items-center">
          <ReactToPrint
            trigger={() => (
              <button data-tip="Save or Print DTR" className="p-4 rounded-md tooltip tooltip-bottom text-white text-sm font-[600] bg-neutral m-auto mb-4">
                Download PDF
              </button>
            )}
            content={() => componentRef.current}
          />
          <div className="flex p-5" ref={componentRef}>
          <table
            className="min-w-full border-2 border-zinc-500 bg-zinc-50 text-sm md:text-base"
         
          >
            <thead>
              <tr className="border-2 border-zinc-500">
                <th className="py-2">Name</th>
                <th
                  className="py-2 font-normal px-4 border border-gray-300"
                  colSpan={2}
                >
                  {userData?.name}
                </th>
                <th className="py-2 px-4 border border-gray-300" colSpan={2}>
                  Month
                </th>
                <th
                  className="py-2 font-normal px-4 border border-gray-300"
                  colSpan={2}
                >
                  July
                </th>
              </tr>
              <tr className="border border-gray-300">
                <th className="py-2"></th>
                <th className="py-2 px-4 border border-gray-300" colSpan={2}>
                  AM
                </th>
                <th className="py-2 px-4 border border-gray-300" colSpan={2}>
                  PM
                </th>
                <th
                  className="py-2 px-4 border border-gray-300"
                  colSpan={2}
                ></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border border-gray-300">
                <th className="py-2 px-4 border border-gray-300">Day</th>
                <th className="py-2 px-4 border border-gray-300">Time In</th>
                <th className="py-2 px-4 border border-gray-300">Time Out</th>
                <th className="py-2 px-4 border border-gray-300">Time In</th>
                <th className="py-2 px-4 border border-gray-300">Time Out</th>
                <th className="py-2 px-4 border border-gray-300">Overtime</th>
                <th className="py-2 px-4 border border-gray-300">Undertime</th>
              </tr>
              {Array.from({ length: 31 }, (_, i) => (
                <tr key={i} className="border border-gray-300">
                  <td className="py-2 px-4 border border-gray-300">{i + 1}</td>
                  <td className="py-2 px-4 border border-gray-300">08:00 AM</td>
                  <td className="py-2 px-4 border border-gray-300">12:00 PM</td>
                  <td className="py-2 px-4 border border-gray-300">01:00 PM</td>
                  <td className="py-2 px-4 border border-gray-300">05:00 PM</td>
                  <td className="py-2 px-4 border border-gray-300">1 hour</td>
                  <td className="py-2 px-4 border border-gray-300">0 hour</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </UserLayout>
    </SignedIn>
  );
};

export default Attendance;
