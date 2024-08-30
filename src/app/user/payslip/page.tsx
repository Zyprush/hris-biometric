"use client";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import UserLayout from "@/components/UserLayout";
import { SignedIn } from "@/components/signed-in";
import React, { useEffect, useRef, useState } from "react";
import { auth, db, rtdb } from "@/firebase";
import { UserDatainterface } from "@/state/interface";
import { useUserStore } from "@/state/user";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { get, ref } from "firebase/database";

interface PayrollData {
  name: string;
  rate: number;
  daysOfWork: number;
  totalRegularWage: number;
  overtime: number;
  holiday: number;
  totalAmount: number;
  sssDeduction: number;
  philhealthDeduction: number;
  pagibigDeduction: number;
  cashAdvance: number;
  totalDeductions: number;
  totalNetAmount: number;
}

const Payslip = () => {
  const componentRef = useRef<HTMLTableElement>(null);
  const [user, loading] = useAuthState(auth);
  const { setUserData, setUser, userData } = useUserStore();
  const [rtdbUserId, setRtdbUserId] = useState<string>("");
  const [payrollData, setPayrollData] = useState<PayrollData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const fetchedUserData = userDocSnap.data() as UserDatainterface;
          setUserData(fetchedUserData);
          setUser(user);

          // Fetch RTDB userId
          if (fetchedUserData.userIdRef) {
            try {
              const userRef = ref(rtdb, `users/${fetchedUserData.userIdRef}`);
              const userSnapshot = await get(userRef);
              const rtdbUserData = userSnapshot.val();
              if (rtdbUserData && rtdbUserData.userid) {
                setRtdbUserId(rtdbUserData.userid);
              }
            } catch (error) {
              console.error(`Error fetching RTDB data:`, error);
            }
          }
        }
      }
    };
    fetchUserData();
  }, [user, setUser, setUserData]);

  useEffect(() => {
    const fetchPayrollData = async () => {
      if (rtdbUserId) {
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
        const payrollRef = doc(db, "payroll", currentMonth);
        const payrollSnap = await getDoc(payrollRef);
        
        if (payrollSnap.exists()) {
          const allPayrollData = payrollSnap.data();
          if (allPayrollData[rtdbUserId]) {
            setPayrollData(allPayrollData[rtdbUserId] as PayrollData);
          } else {
            console.warn(`No payroll data found for user with ID: ${rtdbUserId}`);
          }
        } else {
          console.warn(`No payroll data found for the current month: ${currentMonth}`);
        }
      }
    };
    fetchPayrollData();
  }, [rtdbUserId]);

  if (loading) return <div>Loading...</div>;

  return (
    <UserRouteGuard>
      <SignedIn>
        <UserLayout>
          <div
            className="w-full h-full flex flex-col justify-start items-center"
            ref={componentRef}
          >
            <div className="p-4 mx-auto mt-10">
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
                        {payrollData?.name || userData?.name || "Name"}
                      </td>
                      <td
                        className="text-right font-bold p-2 border border-gray-300 align-middle"
                        colSpan={2}
                      >
                        {payrollData?.totalAmount.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        DATE
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle">
                        OT
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle">
                        {payrollData?.overtime.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        DOW
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                        {payrollData?.daysOfWork || "0"} DAYS
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle">
                        Holiday
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle">
                        {payrollData?.holiday.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        RATE
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                        {payrollData?.rate.toFixed(2) || "0.00"}
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle">
                        Total Regular Wage
                      </td>
                      <td className="text-center p-2 border border-gray-300 align-middle">
                        {payrollData?.totalRegularWage.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        CASH ADVANCE
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                        {payrollData?.cashAdvance.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        SSS
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                        {payrollData?.sssDeduction.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        PHILHEALTH
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                        {payrollData?.philhealthDeduction.toFixed(2) || "0.00"}
                      </td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                      <td className="p-2 border border-gray-300 align-middle"></td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle">
                        PAG IBIG
                      </td>
                      <td className="p-2 border border-gray-300 align-middle">
                        {payrollData?.pagibigDeduction.toFixed(2) || "0.00"}
                      </td>
                      <td className="text-right font-bold p-2 border border-gray-300 align-middle">
                        Total Deductions
                      </td>
                      <td className="text-right font-bold p-2 border border-gray-300 align-middle">
                        {payrollData?.totalDeductions.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                    <tr>
                      <td className="font-semibold p-2 border border-gray-300 align-middle" colSpan={2}></td>
                      <td className="text-right font-bold p-2 border border-gray-300 align-middle">
                        NET PAY
                      </td>
                      <td className="text-right font-bold p-2 border border-gray-300 align-middle">
                        {payrollData?.totalNetAmount.toFixed(2) || "0.00"}
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