"use client";
import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/state/user";
import { SignedIn } from "@/components/signed-in";
import Userlayout from "@/components/UserLayout";
import FingerprintLoading from "@/components/Loading";
import { MdEmail, MdWork } from "react-icons/md";
import { FaIdBadge, FaPhone } from "react-icons/fa";
import { FaBuildingUser } from "react-icons/fa6";
import { useEffect } from "react";
import AdminRouteGuard from "@/app/AdminRouteGuard/page";
import UserRouteGuard from "@/app/UserRouteGuard/page";

const UserDashboard = () => {
  const [user, authLoading] = useAuthState(auth);
  const { user: userData, loading, fetchUserData, signOut } = useUserStore();
  const router = useRouter();

  const handleSignOut = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    signOut();
    router.push("/sign-in");
  };

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
    }
  }, [user, fetchUserData]);

  useEffect(() => {
    if (userData?.role === "admin") {
      router.push("/admin-dashboard");
    }
  }, [userData, router]);

  if (authLoading || loading) {
    return (
      <Userlayout>
        <FingerprintLoading />
      </Userlayout>
    );
  }

  return (
    <UserRouteGuard>
      <SignedIn>
        <Userlayout>
          <div className="container flex flex-col items-center justify-center p-4">
            <div className="p-6 relative gap-2 bg-white text-sm mx-auto mt-[10%] md:min-w-[25rem] border rounded-lg">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Welcome, {userData?.name}
              </h2>
              <UserInfo
                label="Email"
                value={userData?.email || ""}
                icon={MdEmail}
              />
              <UserInfo
                label="Employee ID"
                value={userData?.employeeId || ""}
                icon={FaIdBadge}
              />
              <UserInfo
                label="Phone"
                value={userData?.phone || ""}
                icon={FaPhone}
              />
              <UserInfo
                label="Department"
                value={userData?.department || ""}
                icon={FaBuildingUser}
              />
              <UserInfo
                label="Position"
                value={userData?.position || ""}
                icon={MdWork}
              />
              <UserInfo
                label="SSN"
                value={userData?.ssn || ""}
                icon={FaIdBadge}
              />
              <UserInfo
                label="Work Permit Number"
                value={userData?.workPermitNumber || ""}
                icon={FaIdBadge}
              />
              <UserInfo
                label="Start Date"
                value={userData?.startDate || ""}
                icon={FaIdBadge}
              />
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-red-600 transition ease-in-out duration-150"
              >
                Sign out
              </button>
            </div>
          </div>
        </Userlayout>
      </SignedIn>
    </UserRouteGuard>
  );
};

interface UserInfoProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

const UserInfo = ({ label, value, icon: Icon }: UserInfoProps) => (
  <p className="text-gray-600 flex gap-1 items-center">
    <Icon className="mr-2" /> <b>{label}:</b> {value}
  </p>
);

export default UserDashboard;
