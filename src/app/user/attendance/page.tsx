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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const date = new Date(value);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear().toString();
    setMonth(month);
    setYear(year);
  };

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div className="container p-2 md:p-10 flex flex-col justify-start items-center">
            <div className="flex gap-2">
              <input
                type="date"
                onChange={handleDateChange}
                className="custom-input"
                placeholder="select month"
                value=""
              />
              <ReactToPrint
                trigger={() => (
                  <button
                    data-tip="Save or Print DTR"
                    className="p-4 rounded-md tooltip tooltip-bottom text-white text-sm font-[600] bg-neutral m-auto mb-4"
                  >
                    Download PDF
                  </button>
                )}
                content={() => componentRef.current}
              />
            </div>

            <div className="flex p-5" ref={componentRef}>
              <Dtr userData={userData} date={`${month}, ${year}`} />
            </div>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default Attendance;
