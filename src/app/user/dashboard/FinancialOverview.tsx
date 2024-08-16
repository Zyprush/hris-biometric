import React, { useState, useMemo, useEffect } from "react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { getTotalDaysPresent } from "./daysPresent";

interface UserData {
  payPeriodProgress: number;
}

interface FinancialOverviewProps {
  userRefId: string;
  dailyRate: number;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ userRefId, dailyRate }) => {
  const [showFinancials, setShowFinancials] = useState(true);

  const calculateWorkingDays = (
    year: number,
    month: number,
    upToDate?: number
  ): Date[] => {
    const date = new Date(year, month, 1);
    const days: Date[] = [];
    while (
      date.getMonth() === month &&
      (!upToDate || date.getDate() <= upToDate)
    ) {
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const userData: UserData = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const currentDate = today.getDate();

    const workingDaysThisMonth = calculateWorkingDays(year, month);
    const workingDaysPassed = calculateWorkingDays(year, month, currentDate);

    const payPeriodProgress = Math.min(
      100,
      Math.floor((workingDaysPassed.length / workingDaysThisMonth.length) * 100)
    );

    return {
      payPeriodProgress,
    };
  }, []);

  const toggleFinancials = () => setShowFinancials(!showFinancials);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-neutral dark:text-white">
          Financial Overview
        </h2>
        <button onClick={toggleFinancials}>
          {showFinancials ? (
            <FaEyeSlash className="dark:text-zinc-300" />
          ) : (
            <FaEye className="dark:text-zinc-300" />
          )}
        </button>
      </div>
      <FinancialDetails showFinancials={showFinancials} userData={userData} userRefId={userRefId} dailyRate={dailyRate}/>
    </div>
  );
};

interface FinancialDetailsProps {
  showFinancials: boolean;
  userData: UserData;
  userRefId: string;
  dailyRate: number;
}

const FinancialDetails: React.FC<FinancialDetailsProps> = ({
  showFinancials,
  userData,
  userRefId,
  dailyRate
}) => {
  const { payPeriodProgress } = userData;
  const [expectedMonthlyEarning, setExpectedMonthlyEarning] = useState<number>(0);

  useEffect(() => {
    const fetchDaysPresent = async () => {
      const daysPresent = await getTotalDaysPresent(userRefId);
      setExpectedMonthlyEarning(daysPresent * dailyRate);
    };

    fetchDaysPresent();
  }, [userRefId]);

  return (
    <>
      <p className="text-2xl font-bold text-green-600 mb-2">
        {showFinancials ? `₱${expectedMonthlyEarning.toFixed(2)}` : "₱****.***"}
      </p>
      <p className="text-sm text-gray-600 dark:text-zinc-300 mb-2">
        Expected Monthly Salary
      </p>
      <ProgressBar progress={payPeriodProgress} />
      <p className="text-sm text-gray-600 dark:text-zinc-300">
        {payPeriodProgress}% of pay period complete
      </p>
    </>
  );
};

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 dark:text-zinc-300">
    <div
      className="bg-blue-600 h-2.5 rounded-full"
      style={{ width: `${progress}%` }}
    />
  </div>
);

export default FinancialOverview;