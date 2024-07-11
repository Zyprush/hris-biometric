"use client";
import { auth, db } from "@/firebase";
import Link from "next/link";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { SignedIn } from "../components/signed-in";
import { SignedOut } from "../components/signed-out";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import Loading from "@/components/Loading";
import { GrFingerPrint } from "react-icons/gr";
import { useRouter } from "next/navigation";

interface UserData {
  name: string;
  email: string;
  employeeId: string;
  role: "user" | "admin";
}

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [signOut] = useSignOut(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setUserDataLoading(true);
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
        setUserDataLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    if (user && userData) {
      if (userData.role === "admin") {
        router.push("/admin/dashboard");
      } else if (userData && userData.role === "user") {
        router.push("/user/dashboard");
      } else {
        // Handle case where role is not set
        console.log("Role is not set");
      }
    }
  }, [user, userData, router]);

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 dark bg-gray-800">
        <div className="flex flex-col w-full max-w-md ">
            <>
              <SignedIn>
                <p className="text-3xl text-white font-bold mx-auto flex gap-2"><GrFingerPrint />HRIS</p>
                <p className="text-xl text-white font-bold mx-auto mt-2">Biometric</p>
                <button
                  className="m-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 mx-auto mt-20"
                >
                  Signing in...
                </button>
              </SignedIn>
              <SignedOut>
                <p className="text-3xl text-white font-bold mx-auto flex gap-2"><GrFingerPrint />HRIS</p>
                <p className="text-xl text-white font-bold mx-auto mt-2">Biometric</p>
                <Link
                  className="m-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150 mx-auto mt-20"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </SignedOut>
            </>
        </div>
      </div>
    </main>
  );
}
