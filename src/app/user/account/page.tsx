"use client";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SignedIn } from "@/components/signed-in";
import Userlayout from "@/components/UserLayout";
import FingerprintLoading from "@/components/Loading";
import { MdEmail, MdWork } from "react-icons/md";
import { FaIdBadge, FaPhone } from "react-icons/fa";
import { FaBuildingUser } from "react-icons/fa6";

interface UserData {
  name: string;
  email: string;
  employeeId: string;
  role: string;
  phone: string;
  department: string;
  position: string;
  ssn: string;
  workPermitNumber: string;
  startDate: string;
}

const UserDashboard = () => {
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data() as UserData);
        }
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (userData?.role === "admin") {
      router.push("/admin-dashboard");
    }
  }, [userData, router]);

  if (loading || !userData) {
    return (
      <Userlayout>
        <FingerprintLoading />
      </Userlayout>
    );
  }

  return (
    <SignedIn>
      <Userlayout>
        <div className="container flex flex-col items-center justify-center p-4">
          <div className="p-6 relative gap-2 bg-white text-sm mx-auto mt-[10%] md:min-w-[25rem] border rounded-lg">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Welcome, {userData.name}
            </h2>
            <UserInfo label="Email" value={userData.email} icon={MdEmail} />
            <UserInfo label="Employee ID" value={userData.employeeId} icon={FaIdBadge} />
            <UserInfo label="Phone" value={userData.phone} icon={FaPhone} />
            <UserInfo label="Department" value={userData.department} icon={FaBuildingUser} />
            <UserInfo label="Position" value={userData.position} icon={MdWork} />
            <UserInfo label="SSN" value={userData.ssn} icon={FaIdBadge} />
            <UserInfo label="Work Permit Number" value={userData.workPermitNumber} icon={FaIdBadge} />
            <UserInfo label="Start Date" value={userData.startDate} icon={FaIdBadge} />
            <button
              onClick={() => auth.signOut()}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-red-600 transition ease-in-out duration-150"
            >
              Sign out
            </button>
          </div>
        </div>
      </Userlayout>
    </SignedIn>
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