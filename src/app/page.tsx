"use client";
import { auth, db } from "@/firebase";
import { IconFidgetSpinner } from "@tabler/icons-react";
import Link from "next/link";
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { SignedIn } from "./components/signed-in";
import { SignedOut } from "./components/signed-out";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

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

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 dark">
        <h1>HOME</h1>
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-md p-6 relative">
          {loading || userDataLoading ? (
            <IconFidgetSpinner className="animate-spin w-12 h-12 mx-auto" />
          ) : (
            <>
              <SignedIn>
                <div className="flex flex-col text-primary-500">
                  <h1 className="text-3xl font-bold">Signed in as</h1>
                  <p>Name: {userData?.name}</p>
                  <p>Email: {userData?.email}</p>
                  <p>Employee ID: {userData?.employeeId}</p>
                  <p>Role: {userData?.role}</p>
                  <p>
                    Email verified:{" "}
                    {user?.emailVerified ? (
                      <span className="text-green-500">Verified</span>
                    ) : (
                      <span className="text-red-500">Not verified, check your email</span>
                    )}
                  </p>
                  <button onClick={() => signOut()} className="text-red-500 font-bold mt-4">
                    Sign out
                  </button>
                </div>
              </SignedIn>
              <SignedOut>
                <Link className="m-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150" href="/sign-in">
                  Sign in
                </Link>
                <Link className="m-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-2 px-4 rounded-md mt-4 hover:bg-indigo-600 hover:to-blue-600 transition ease-in-out duration-150" href="/sign-up">
                  Create account
                </Link>
              </SignedOut>
            </>
          )}
        </div>
      </div>
    </main>
  );
}