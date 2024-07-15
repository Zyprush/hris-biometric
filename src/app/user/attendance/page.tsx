"use client";
import FingerprintLoading from "@/components/Loading";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import { auth } from "@/firebase";
import { useUserStore } from "@/state/user";
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactToPrint from "react-to-print";
import Dtr from "./Dtr";
import UserRouteGuard from "@/app/UserRouteGuard/page";

const Attendance = () => {
  const componentRef = useRef<HTMLTableElement>(null);
  const [user, authLoading] = useAuthState(auth);
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const { userData: userData, loading, fetchUserData } = useUserStore();
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

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYear(e.target.value);
  };

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div className="container p-2 md:p-10 flex flex-col justify-start items-center">
            <div className="flex gap-2">
              <select
                onChange={handleMonthChange}
                className="border-2 rounded-md p-2 px-3"
                value={month}
              >
                <option value="">Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
              <select
                onChange={handleYearChange}
                className="border-2 rounded-md p-2 px-3"
                value={year}
              >
                <option value="">Year</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={2020 + i}>{2020 + i}</option>
                ))}
              </select>
              <ReactToPrint
                trigger={() => (
                  <button
                    data-tip="Save or Print DTR"
                    className="p-4 rounded-md tooltip tooltip-bottom text-white text-sm font-[600] bg-neutral fixed bottom-4 right-4"
                  >
                    Download PDF
                  </button>
                )}
                content={() => componentRef.current}
              />
            </div>

            <div className="flex p-5" ref={componentRef}>
              <Dtr userData={userData} date={`${month} ${year}`} />
            </div>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default Attendance;
