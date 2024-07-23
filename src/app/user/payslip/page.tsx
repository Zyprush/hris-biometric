"use client";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import React, { useEffect, useRef } from "react";
import { auth, db } from "@/firebase";
import { UserDatainterface } from "@/state/interface";
import { useUserStore } from "@/state/user";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import ReactToPrint from "react-to-print";

const Payslip = () => {
  const componentRef = useRef<HTMLTableElement>(null);
  const [user, loading] = useAuthState(auth);
  const { setUserData, setUser, userData } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserDatainterface);
          setUser(user);
        }
      }
    };
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setUser]);
  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div
            className="w-full h-full flex flex-col justify-start items-center"
            ref={componentRef}
          >
            <div className="p-4 mx-auto mt-10">
              <ReactToPrint
                trigger={() => (
                  <button
                    data-tip="Save or Print DTR"
                    className="p-4 text-xs md:text-sm rounded-md tooltip tooltip-top text-white font-[600] bg-neutral fixed bottom-4 right-4"
                  >
                    Download Payslip
                  </button>
                )}
                content={() => componentRef.current}
                pageStyle={"flex justify-start items-start p-20"}
              />
              <div className="bg-white border border-gray-300 shadow-md">
                <h1 className="text-xl font-bold p-2 bg-primary border-b border-gray-300 text-white">
                  PAYSLIP
                </h1>
                <table className="w-full text-sm border-collapse">
                  <tbody>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        NAME
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                      {userData?.cashAdvance}
                      </td>
                      <td
                        className="text-right font-bold p-2 border border-gray-300 align-middle"
                        colSpan={2}
                      >
                        3,017.50
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        DATE
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                        MAY 1-15, 2023
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle">
                        OT
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle"></td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        DOW
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                        8.5 DAYS
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle">
                        30%
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle"></td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        VALE
                      </td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                      <td className="text-center p-2 border border-gray-300 align-middle">
                        HP
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle"></td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        CASH ADVANCE
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">{userData?.cashAdvance}</td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        LATE
                      </td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        SSS
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                        {userData?.sssDeduction}
                      </td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        PHILHEALTH
                      </td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                      <td className="p-2 border border-gray-300 align-middle">
                        Total Deduction
                      </td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        PAG IBIG
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">{userData?.philhealthDeduction}</td>
                      <td className="text-right font-bold p-2 border border-gray-300 align-middle">
                        NET PAY
                      </td>
                      <td className="text-right font-bold p-2 border border-gray-300 align-middle">
                        3,017.50
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </UserLayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

export default Payslip;
