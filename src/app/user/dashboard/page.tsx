"use client";
import { SignedIn } from "@/components/signed-in";
import Userlayout from "@/components/UserLayout";
import {
  FaClipboardList,
  FaUserAlt,
  FaMoneyCheckAlt,
  FaEye,
  FaEyeSlash,
  FaCalendarAlt,
  FaUsers,
} from "react-icons/fa";
import Link from "next/link";
import { UserRouteGuard } from "@/components/UserRouteGuard";
import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { FaUser } from "react-icons/fa6";
import { format } from "date-fns"; // Add this import

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface UserData {
  role: "user" | "admin";
  name: string;
  nickname: string;
  department?: string;
  profilePicUrl?: string;
  attendanceStatus?: string;
}

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
      // 0 is Sunday, 6 is Saturday
      days.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const calculateProgress = (): number => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const currentDate = today.getDate();

  const workingDaysThisMonth = calculateWorkingDays(year, month);
  const workingDaysPassed = calculateWorkingDays(year, month, currentDate);

  return Math.min(
    100,
    Math.floor((workingDaysPassed.length / workingDaysThisMonth.length) * 100)
  );
};

export default function UserDashboard() {
  const [showFinancials, setShowFinancials] = useState(true);
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [teamData, setTeamData] = useState<UserData[]>([]);

  const fetchUserData = useMemo(
    () => async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as UserData);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    },
    [user]
  );

  const fetchTeamData = useMemo(
    () => async () => {
      if (user && userData?.department) {
        try {
          const teamQuery = query(
            collection(db, "users"),
            where("department", "==", userData.department)
          );
          const teamDocSnap = await getDocs(teamQuery);
          const teamData = teamDocSnap.docs.map(
            (doc) => doc.data() as UserData
          );
          setTeamData(teamData);
        } catch (error) {
          console.error("Error fetching team data:", error);
        }
      }
    },
    [user, userData?.department]
  );

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userData?.department) {
      fetchTeamData();
    }
  }, [userData?.department, fetchTeamData]);

  const today = new Date();
  const workingDaysPassed = calculateWorkingDays(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const userDataExample = {
    expectedMonthlyEarning: 350 * workingDaysPassed.length,
    payPeriodProgress: calculateProgress(),
  };

  const attendanceData = {
    labels: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
    ],
    datasets: [
      {
        label: "Regular Hours",
        data: [8, 8, 8, 8, 8, 0, 0, 8, 8, 8, 8, 8],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        fill: true,
      },
      {
        label: "Overtime Hours",
        data: [1, 0, 2, 1, 0, 4, 0, 0, 1, 2, 0, 1],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Attendance and Overtime",
      },
    },
    scales: {
      y: {
        stacked: true,
        title: {
          display: true,
          text: "Hours",
        },
      },
    },
  };

  const QuickActionButton = ({
    icon: Icon,
    label,
    onClick,
  }: {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
  }) => (
    <button
      className="flex items-center justify-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-neutral transition-colors"
      onClick={onClick}
    >
      <Icon />
      {label}
    </button>
  );

  return (
    <UserRouteGuard>
      <SignedIn>
        <Userlayout>
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">
              Welcome, {userData?.nickname || "user"}!
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Financial Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-neutral">
                    Financial Overview
                  </h2>
                  <button onClick={() => setShowFinancials(!showFinancials)}>
                    {showFinancials ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {showFinancials ? (
                  <>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ₱{userDataExample.expectedMonthlyEarning.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Expected Monthly Salary
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${userDataExample.payPeriodProgress}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {userDataExample.payPeriodProgress}% of pay period
                      complete
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      ₱****.**
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      Expected Monthly Salary
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${userDataExample.payPeriodProgress}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {userDataExample.payPeriodProgress}% of pay period
                      complete
                    </p>
                  </>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-neutral">
                  Quick Actions
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Link href="/user/request">
                    <QuickActionButton icon={FaUserAlt} label="Leave Request" />
                  </Link>
                  <Link href="/user/payslip">
                    <QuickActionButton
                      icon={FaMoneyCheckAlt}
                      label="View Payslip"
                    />
                  </Link>
                </div>
              </div>

              {/* Leave/Day Off Balance */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-neutral">
                  Leave Taken
                </h2>
                <div className="stats shadow mx-auto flex">
                  <div className="stat">
                    {/* <div className="stat-title">{new Date().toLocaleString('default', { month: 'long' })}</div> */}
                    <div className="stat-value text-primary">12</div>
                    <div className="stat-desc"> Leave this month</div>
                  </div>

                  <div className="stat">
                    {/* <div className="stat-title">{new Date().getFullYear()}</div> */}
                    <div className="stat-value text-primary">24</div>
                    <div className="stat-desc">Leave this year</div>
                  </div>
                </div>
              </div>

              {/* Productivity Chart */}
              <div className="bg-white rounded-lg shadow p-6 col-span-full md:col-span-2">
                <h2 className="text-xl font-semibold mb-4 text-neutral">
                  Attendance and Overtime
                </h2>
                <Line options={options} data={attendanceData} />
              </div>

              {/* Team Status */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 text-neutral">
                  Team Status
                </h2>
                <ul className="space-y-4">
                  {teamData.map((member, index) => (
                    <li
                      key={index}
                      className="flex items-center text-neutral gap-2"
                    >
                      <img
                        src={member?.profilePicUrl || "/img/profile-male.jpg"}
                        alt={member?.name}
                        className="rounded-full object-cover w-14 h-14 border-2 border-primary"
                      />
                      <span className="font-semibold text-sm flex flex-col items-start">
                        <p>{member.name}</p>
                        <p
                          className={`p-1 px-2 rounded-md text-white w-auto ${
                            member.attendanceStatus === "present"
                              ? "bg-[#61a34a]"
                              : "bg-neutral"
                          }`}
                        >
                          {member.attendanceStatus}
                        </p>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Original Dashboard Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <DashboardLink
                href="/user/attendance"
                icon={FaClipboardList}
                title="Attendance"
                description="Track your daily attendance records and monitor your punctuality over time here."
              />
              <DashboardLink
                href="/user/request"
                icon={FaUserAlt}
                title="Leave Request"
                description="Submit your leave requests and check the status of your previous requests here."
              />
              <DashboardLink
                href="/user/payslip"
                icon={FaMoneyCheckAlt}
                title="View Pay Slip"
                description="Access your monthly pay slips and review your salary and bonus details here."
              />
            </div>
          </div>
        </Userlayout>
      </SignedIn>
    </UserRouteGuard>
  );
}

interface DashboardLinkProps {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const DashboardLink: React.FC<DashboardLinkProps> = ({
  href,
  icon: Icon,
  title,
  description,
}) => (
  <Link
    href={href}
    className="bg-white text-zinc-700 rounded-lg p-8 gap-3 flex flex-col border hover:bg-neutral hover:text-white group transition-colors"
  >
    <span className="flex gap-3">
      <Icon className="text-3xl" />
      <p className="text-2xl font-bold ">{title}</p>
    </span>
    <p className="text-sm text-zinc-500 group-hover:text-zinc-200">
      {description}
    </p>
  </Link>
);
