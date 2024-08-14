"use client";
import React, { useEffect, useState, useRef } from "react";
import { UserDatainterface } from "@/state/interface";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import AdminLayout from "@/components/AdminLayout";
import { AdminRouteGuard } from "@/components/AdminRouteGuard";
import { SignedIn } from "@/components/signed-in";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

const EmploymentCert: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  const [userData, setUserData] = useState<UserDatainterface>();
  const certRef = useRef<HTMLDivElement>(null);

  const getFormattedDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const suffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `Issued this ${day}${suffix(day)} day of ${month}, year ${year}`;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userDocRef = doc(db, "users", id);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data() as UserDatainterface);
      }
    };
    fetchUserData();
  }, [id]);

  const handlePrint = useReactToPrint({
    content: () => certRef.current,
    pageStyle: `
      @page {
        margin: 0;
      }
      body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: start;
        height: 100vh;
      }
      #print-content {
        width: 100%;
        max-width: 800px;
        margin: 80px 40px 40px 40px ;
      }
    `,
  });

  return (
    <AdminRouteGuard>
      <SignedIn>
        <AdminLayout>
          <div className="w-full h-full p-10 flex flex-col items-center">
            <div ref={certRef} id="print-content" className="text-lg p-5 max-w-xl mx-auto text-zinc-700 dark:text-white">
              <h1 className="text-center uppercase font-bold text-xl">
                Certificate of Employment
              </h1>

              <p className="mt-10">To Whom It May Concern,</p>

              <p className="mt-10">
                This is to certify that <b>{userData?.name}</b> is a bonafide employee
                of <b>Beper Shopping Center</b> holding the position of {userData?.position} from {userData?.startDate && format(new Date(userData?.startDate), "MMM dd, yyyy")} up to the present.
              </p>

              <p>
                This certification is being issued upon the request of
                {userData?.name} for any purpose it may serve.
              </p>

              <p className="mt-10">
                {getFormattedDate()} in Brgy. 6 Mamburao, Occidental Mindoro
                Philippines.
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="mt-5 p-2 bg-blue-500 text-white rounded"
            >
              Print Certificate
            </button>
          </div>
        </AdminLayout>
      </SignedIn>
    </AdminRouteGuard>
  );
};

export default EmploymentCert;
